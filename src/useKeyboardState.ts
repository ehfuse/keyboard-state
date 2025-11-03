/**
 * useKeyboardState Hook
 * 키보드 상태 관리 및 단축키 등록을 위한 React Hook
 */

import { useEffect, useCallback, useRef } from "react";
import { useGlobalFormaState } from "@ehfuse/forma";
import type {
    KeyState,
    KeyComboInput,
    KeyComboOptions,
    KeyboardState,
    KeyType,
    KeyboardShortcuts,
    KeyboardShortcutItem,
} from "./types";
import { normalizeKey } from "./utils";
import {
    globalEventListenersRegistered,
    setGlobalEventListenersRegistered,
    globalWatchKey,
} from "./globalState";
import {
    createKeyDownHandler,
    createKeyUpHandler,
    createResetHandler,
    createVisibilityChangeHandler,
} from "./eventHandlers";

/**
 * 키보드 상태를 구독하고 단축키를 등록하는 Hook
 *
 * 사용법:
 * 1. const keyboard = useKeyboardState(); // 상태만 구독
 * 2. useKeyboardState('ctrl+s', () => {}); // 단축키 등록
 * 3. useKeyboardState({ 'ctrl+s': callback }); // 여러 단축키 등록
 */
export function useKeyboardState(
    comboOrShortcuts?:
        | KeyComboInput
        | KeyboardShortcuts
        | KeyboardShortcutItem[],
    callback?: () => void,
    options?: KeyComboOptions
): KeyboardState | void {
    const forma = useGlobalFormaState({
        stateId: "__keyboard_state__",
        initialValues: {
            capsLock: false,
            shift: false,
            ctrl: false,
            alt: false,
            meta: false,
            pressedKeys: new Set<string>(),
            lastPressedKey: null,
        },
    });

    // globalState를 window에 저장하여 eventHandlers에서 접근 가능하도록
    useEffect(() => {
        (window as any).__keyboardState__ = forma;
    }, [forma]);

    // 상태 값들
    const capsLock = forma.useValue("capsLock");
    const shift = forma.useValue("shift");
    const ctrl = forma.useValue("ctrl");
    const alt = forma.useValue("alt");
    const meta = forma.useValue("meta");
    const pressedKeys = forma.useValue("pressedKeys");
    const lastPressedKey = forma.useValue("lastPressedKey");

    // 전역 이벤트 리스너 등록
    useEffect(() => {
        if (globalEventListenersRegistered) return;

        const keyDownHandler = createKeyDownHandler();
        const keyUpHandler = createKeyUpHandler();
        const resetHandler = createResetHandler();
        const visibilityChangeHandler = createVisibilityChangeHandler();

        window.addEventListener("keydown", keyDownHandler, { capture: true });
        window.addEventListener("keyup", keyUpHandler, { capture: true });
        window.addEventListener("blur", resetHandler);
        window.addEventListener("focus", resetHandler);
        document.addEventListener("visibilitychange", visibilityChangeHandler);

        setGlobalEventListenersRegistered(true);

        return () => {
            window.removeEventListener("keydown", keyDownHandler, {
                capture: true,
            });
            window.removeEventListener("keyup", keyUpHandler, {
                capture: true,
            });
            window.removeEventListener("blur", resetHandler);
            window.removeEventListener("focus", resetHandler);
            document.removeEventListener(
                "visibilitychange",
                visibilityChangeHandler
            );
            setGlobalEventListenersRegistered(false);
        };
    }, []);

    // 콜백을 ref에 저장하여 안정적인 참조 유지
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // watchKey 메서드
    const watchKey = globalWatchKey;

    // isKeyPressed 메서드
    const isKeyPressed = useCallback(
        (key: KeyType | KeyType[]) => {
            if (Array.isArray(key)) {
                // 배열인 경우: 모든 키가 눌려있는지 확인 (AND 조건)
                return key.every((k) =>
                    pressedKeys.has(normalizeKey(String(k)))
                );
            }
            // 단일 키인 경우
            return pressedKeys.has(normalizeKey(String(key)));
        },
        [pressedKeys]
    );

    // 상태 객체 생성 (항상 생성)
    const state: KeyboardState = {
        // 기본 상태
        capsLock,
        shift,
        ctrl,
        alt,
        meta,
        pressedKeys,
        lastPressedKey,

        // 조합 체크 헬퍼
        isCtrlOrMeta: ctrl || meta,

        // 메서드
        watchKey,
        isKeyPressed,
    };

    // 단축키 등록 처리
    useEffect(() => {
        if (!comboOrShortcuts) return;

        const cleanups: (() => void)[] = [];

        // 1. 객체 형태: { 'ctrl+s': callback, 'escape': callback }
        if (
            typeof comboOrShortcuts === "object" &&
            !Array.isArray(comboOrShortcuts) &&
            !("key" in comboOrShortcuts)
        ) {
            const shortcuts = comboOrShortcuts as KeyboardShortcuts;
            (Object.keys(shortcuts) as string[]).forEach((combo: string) => {
                cleanups.push(watchKey(combo, shortcuts[combo]));
            });
        }
        // 2. 배열 형태: [{ key, callback, options }, ...]
        else if (
            Array.isArray(comboOrShortcuts) &&
            comboOrShortcuts.length > 0 &&
            typeof comboOrShortcuts[0] === "object" &&
            "key" in comboOrShortcuts[0]
        ) {
            comboOrShortcuts.forEach((item) => {
                if (
                    typeof item === "object" &&
                    item !== null &&
                    "key" in item &&
                    "callback" in item
                ) {
                    const shortcut = item as {
                        key: KeyComboInput;
                        callback: () => void;
                        options?: KeyComboOptions;
                    };
                    cleanups.push(
                        watchKey(
                            shortcut.key,
                            shortcut.callback,
                            shortcut.options
                        )
                    );
                }
            });
        }
        // 3. 단일 키 조합: 'ctrl+s' 또는 ['Ctrl', 'S']
        else if (callbackRef.current) {
            // 안정적인 래퍼 함수 사용
            const stableCallback = () => {
                if (callbackRef.current) {
                    callbackRef.current();
                }
            };
            cleanups.push(
                watchKey(
                    comboOrShortcuts as KeyComboInput,
                    stableCallback,
                    options
                )
            );
        }

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(comboOrShortcuts)]);

    // 인자가 없으면 상태 반환, 있으면 void 반환
    if (comboOrShortcuts === undefined) {
        return state;
    }
}

// 기본 내보내기
export default useKeyboardState;

// 타입 내보내기
export type {
    KeyState,
    KeyCombo,
    KeyComboInput,
    KeyComboOptions,
    KeyboardState,
} from "./types";
