/**
 * Event Handlers
 * 키보드 이벤트 핸들러 로직
 */

import type { KeyState } from "./types";
import { normalizeKey, createComboKey } from "./utils";
import {
    globalKeyComboCallbacks,
    globalKeyWatchCallbacks,
    globalHoldTimers,
    globalFocusStealingKeyTimer,
    globalKeySequence,
    globalKeySequenceTimer,
    globalState,
    setGlobalFocusStealingKeyTimer,
    setGlobalKeySequence,
    setGlobalKeySequenceTimer,
} from "./globalState";

/**
 * keydown 이벤트 핸들러
 */
export function createKeyDownHandler() {
    return (event: KeyboardEvent) => {
        if (!event || typeof event.getModifierState !== "function") return;
        if (!globalState) return;

        const key = normalizeKey(event.key);
        const currentPressedKeys = new Set<string>(
            globalState.getValue("pressedKeys")
        );
        currentPressedKeys.add(key);

        // Alt 또는 Meta 키가 단독으로 눌렸을 때 (포커스를 빼앗을 수 있는 키)
        // 100ms 후에도 keyup이 발생하지 않으면 상태 리셋
        if (
            (key === "alt" || key === "meta") &&
            !event.ctrlKey &&
            !event.shiftKey
        ) {
            if (globalFocusStealingKeyTimer) {
                clearTimeout(globalFocusStealingKeyTimer);
            }

            const timerId = window.setTimeout(() => {
                globalState.setValues({
                    shift: false,
                    ctrl: false,
                    alt: false,
                    meta: false,
                    pressedKeys: new Set<string>(),
                });
            }, 100);
            setGlobalFocusStealingKeyTimer(timerId);
        }

        // 모든 수정자 키 상태를 한 번에 업데이트
        globalState.setValues({
            capsLock: event.getModifierState("CapsLock"),
            shift: event.shiftKey,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey,
            pressedKeys: currentPressedKeys,
            lastPressedKey: key,
        });

        // 특정 키 감시 콜백 실행
        const watchCallbacks = globalKeyWatchCallbacks.get(key);
        if (watchCallbacks) {
            if (key === "backspace" || key === "tab") {
                event.preventDefault();
            }
            watchCallbacks.forEach((callback) => callback(key));
        }

        // 키 조합 감지 및 처리
        handleKeyCombo(event, key);

        // 연속 키 입력 처리 (Vim 스타일: 'g i', 'g h')
        handleKeySequence(event, key);
    };
}

/**
 * 키 조합 처리
 */
function handleKeyCombo(event: KeyboardEvent, key: string) {
    const comboKey = createComboKey({
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
        key,
    });

    const comboData = globalKeyComboCallbacks.get(comboKey);
    if (!comboData) return;

    const { callback, options } = comboData;

    // enabled 체크
    if (!options.enabled) return;

    // classes 스코프 체크
    if (options.classes.length > 0) {
        const target = event.target as HTMLElement;
        const hasMatchingClass = options.classes.some((className) => {
            const cleanClass = className.startsWith(".")
                ? className.slice(1)
                : className;
            return target.closest(`.${cleanClass}`) !== null;
        });
        if (!hasMatchingClass) return;
    }

    // preventDefault 처리
    if (options.preventDefault) {
        event.preventDefault();
    }

    // 키 홀드 감지 설정
    if (options.holdDuration > 0) {
        if (!event.repeat && !globalHoldTimers.has(comboKey)) {
            const timerId = window.setTimeout(() => {
                if (options.onHold) {
                    options.onHold();
                }
                globalHoldTimers.delete(comboKey);
            }, options.holdDuration);
            globalHoldTimers.set(comboKey, timerId);
        }
    } else {
        // 홀드 설정이 없으면 즉시 콜백 실행 (반복 입력 무시)
        if (!event.repeat) {
            callback();
        }
    }
}

/**
 * 키 시퀀스 처리 (Vim 스타일)
 */
function handleKeySequence(event: KeyboardEvent, key: string) {
    // 수정자 키 없이 단일 키만 눌렸을 때만 시퀀스에 추가
    if (
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.metaKey ||
        key.length !== 1
    ) {
        return;
    }

    // 기존 타이머 클리어
    if (globalKeySequenceTimer) {
        clearTimeout(globalKeySequenceTimer);
    }

    // 시퀀스에 추가
    const newSequence = [...globalKeySequence, key];
    setGlobalKeySequence(newSequence);

    // 시퀀스 문자열 생성
    const sequence = newSequence.join(" ");

    // 시퀀스 매칭 확인
    const sequenceData = globalKeyComboCallbacks.get(sequence);
    if (sequenceData) {
        const { callback, options } = sequenceData;

        if (!options.enabled) return;

        // classes 스코프 체크
        let shouldExecute = true;
        if (options.classes.length > 0) {
            const target = event.target as HTMLElement;
            const hasMatchingClass = options.classes.some((className) => {
                const cleanClass = className.startsWith(".")
                    ? className.slice(1)
                    : className;
                return target.closest(`.${cleanClass}`) !== null;
            });
            shouldExecute = hasMatchingClass;
        }

        if (shouldExecute) {
            if (options.preventDefault) {
                event.preventDefault();
            }
            callback();
            setGlobalKeySequence([]);
            return;
        }
    }

    // 1초 후 시퀀스 초기화
    const timerId = window.setTimeout(() => {
        setGlobalKeySequence([]);
    }, 1000);
    setGlobalKeySequenceTimer(timerId);
}

/**
 * keyup 이벤트 핸들러
 */
export function createKeyUpHandler() {
    return (event: KeyboardEvent) => {
        if (!event || typeof event.getModifierState !== "function") return;
        if (!globalState) return;

        const key = normalizeKey(event.key);
        const currentPressedKeys = new Set<string>(
            globalState.getValue("pressedKeys")
        );
        currentPressedKeys.delete(key);

        // Alt/Meta 키의 keyup을 받았다면 타이머 클리어
        if ((key === "alt" || key === "meta") && globalFocusStealingKeyTimer) {
            clearTimeout(globalFocusStealingKeyTimer);
            setGlobalFocusStealingKeyTimer(null);
        }

        globalState.setValues({
            capsLock: event.getModifierState("CapsLock"),
            shift: event.shiftKey,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey,
            pressedKeys: currentPressedKeys,
        });

        // 키 릴리즈 이벤트 처리 및 홀드 타이머 정리
        const comboKey = createComboKey({
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            alt: event.altKey,
            meta: event.metaKey,
            key,
        });

        // 홀드 타이머가 있으면 정리
        const timerId = globalHoldTimers.get(comboKey);
        if (timerId) {
            clearTimeout(timerId);
            globalHoldTimers.delete(comboKey);
        }

        // onRelease 콜백 실행
        const comboData = globalKeyComboCallbacks.get(comboKey);
        if (comboData && comboData.options.onRelease) {
            comboData.options.onRelease();
        }
    };
}

/**
 * 포커스 관련 이벤트 핸들러
 */
export function createResetHandler() {
    return () => {
        if (!globalState) return;
        globalState.setValues({
            shift: false,
            ctrl: false,
            alt: false,
            meta: false,
            pressedKeys: new Set<string>(),
        });
    };
}

export function createVisibilityChangeHandler() {
    return () => {
        if (document.hidden && globalState) {
            globalState.setValues({
                shift: false,
                ctrl: false,
                alt: false,
                meta: false,
                pressedKeys: new Set<string>(),
            });
        }
    };
}
