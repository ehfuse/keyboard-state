/**
 * Global State Management
 * 전역 상태 및 콜백 관리
 */

import type {
    KeyComboCallback,
    KeyPressCallback,
    KeyComboOptions,
    KeyComboInput,
} from "./types";
import { parseKeyCombo, createComboKey } from "./utils";

// 전역 저장소들 (모든 useKeyboardState 호출이 공유)
export const globalKeyComboCallbacks = new Map<
    string,
    {
        callback: KeyComboCallback;
        options: Required<KeyComboOptions>;
    }
>();

export const globalKeyWatchCallbacks = new Map<string, KeyPressCallback[]>();
export const globalHoldTimers = new Map<string, number>();
export const globalRegisteredShortcuts = new Set<string>();

export let globalFocusStealingKeyTimer: number | null = null;
export let globalKeySequence: string[] = [];
export let globalKeySequenceTimer: number | null = null;
export let globalEventListenersRegistered = false;

// globalState는 이제 useGlobalFormaState로 관리됨
// 이벤트 핸들러에서 사용하기 위한 참조만 유지
export const globalState = {
    getValue: (key: string) => {
        // useGlobalFormaState를 통해 접근하도록 유도
        if (
            typeof window !== "undefined" &&
            (window as any).__keyboardState__
        ) {
            return (window as any).__keyboardState__.getValue(key);
        }
        return undefined;
    },
    setValue: (key: string, value: any) => {
        if (
            typeof window !== "undefined" &&
            (window as any).__keyboardState__
        ) {
            (window as any).__keyboardState__.setValue(key, value);
        }
    },
    setValues: (values: Record<string, any>) => {
        if (
            typeof window !== "undefined" &&
            (window as any).__keyboardState__
        ) {
            (window as any).__keyboardState__.setValues(values);
        }
    },
};

// 전역 변수 setter 함수들
export function setGlobalFocusStealingKeyTimer(timer: number | null) {
    globalFocusStealingKeyTimer = timer;
}

export function setGlobalKeySequence(sequence: string[]) {
    globalKeySequence = sequence;
}

export function setGlobalKeySequenceTimer(timer: number | null) {
    globalKeySequenceTimer = timer;
}

export function setGlobalEventListenersRegistered(registered: boolean) {
    globalEventListenersRegistered = registered;
}

/**
 * 전역 키 감시 등록 함수
 * @param combo - 감시할 키 조합
 * @param callback - 키가 눌렸을 때 실행할 콜백
 * @param options - 옵션 (preventDefault, enabled, classes, holdDuration, onHold, onRelease)
 * @returns 등록 해제 함수
 */
export function globalWatchKey(
    combo: KeyComboInput,
    callback: KeyComboCallback,
    options?: KeyComboOptions
): () => void {
    const keyCombo = parseKeyCombo(combo);
    const comboKey = createComboKey(keyCombo);

    // 옵션 기본값 설정
    const finalOptions: Required<KeyComboOptions> = {
        preventDefault: options?.preventDefault ?? true,
        enabled: options?.enabled ?? true,
        classes: options?.classes ?? [],
        holdDuration: options?.holdDuration ?? 0,
        onHold: options?.onHold ?? (() => {}),
        onRelease: options?.onRelease ?? (() => {}),
    };

    // 단축키 충돌 감지
    if (globalRegisteredShortcuts.has(comboKey)) {
        console.warn(
            `⚠️ Duplicate keyboard shortcut detected: "${comboKey}". This will override the previous registration.`
        );
    }
    globalRegisteredShortcuts.add(comboKey);

    globalKeyComboCallbacks.set(comboKey, {
        callback,
        options: finalOptions,
    });

    // 정리 함수 반환
    return () => {
        globalKeyComboCallbacks.delete(comboKey);
        globalRegisteredShortcuts.delete(comboKey);

        // 홀드 타이머도 정리
        const timerId = globalHoldTimers.get(comboKey);
        if (timerId) {
            clearTimeout(timerId);
            globalHoldTimers.delete(comboKey);
        }
    };
}

/**
 * 특정 키의 입력을 감시하는 함수
 * @param key - 감시할 키
 * @param callback - 키 입력 시 호출될 콜백
 * @returns 등록 해제 함수
 */
export function globalRegisterKeyPress(
    key: string,
    callback: KeyPressCallback
): () => void {
    if (!globalKeyWatchCallbacks.has(key)) {
        globalKeyWatchCallbacks.set(key, []);
    }

    const callbacks = globalKeyWatchCallbacks.get(key)!;
    callbacks.push(callback);

    return () => {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
            globalKeyWatchCallbacks.delete(key);
        }
    };
}
