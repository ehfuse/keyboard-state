import { useRef, useState, useCallback, useEffect } from "react";
import type {
    RecordedMacro,
    RecordedKeyEvent,
    KeyboardRecording,
} from "./types";

/**
 * 키보드 입력을 녹화하고 재생하는 훅
 *
 * @example
 * ```tsx
 * const { isRecording, startRecording, stopRecording, playMacro, recordedMacro } = useKeyboardRecording();
 *
 * // 녹화 시작
 * startRecording();
 *
 * // 녹화 중지 및 매크로 가져오기
 * const macro = stopRecording();
 *
 * // 매크로 재생
 * if (macro) {
 *   playMacro(macro);
 * }
 * ```
 */
export function useKeyboardRecording(): KeyboardRecording {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedMacro, setRecordedMacro] = useState<RecordedMacro | null>(
        null
    );

    const recordingStartTimeRef = useRef<number>(0);
    const recordedEventsRef = useRef<RecordedKeyEvent[]>([]);
    const playbackAbortControllerRef = useRef<AbortController | null>(null);

    // 녹화 이벤트 핸들러
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!isRecording) return;

            const key = event.key.toLowerCase();
            const timestamp = Date.now() - recordingStartTimeRef.current;

            const recordedEvent: RecordedKeyEvent = {
                key,
                timestamp,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                alt: event.altKey,
                meta: event.metaKey,
            };

            recordedEventsRef.current.push(recordedEvent);
        },
        [isRecording]
    );

    // 녹화 시작
    const startRecording = useCallback(() => {
        recordingStartTimeRef.current = Date.now();
        recordedEventsRef.current = [];
        setIsRecording(true);
        setRecordedMacro(null);
    }, []);

    // 녹화 중지
    const stopRecording = useCallback((): RecordedMacro | null => {
        if (!isRecording) return null;

        setIsRecording(false);

        const duration = Date.now() - recordingStartTimeRef.current;
        const macro: RecordedMacro = {
            keys: [...recordedEventsRef.current],
            duration,
        };

        setRecordedMacro(macro);
        return macro;
    }, [isRecording]);

    // 녹화 초기화
    const clearRecording = useCallback(() => {
        recordedEventsRef.current = [];
        setRecordedMacro(null);
    }, []);

    // 매크로 재생
    const playMacro = useCallback(
        async (macro: RecordedMacro): Promise<void> => {
            // 이전 재생 중단
            if (playbackAbortControllerRef.current) {
                playbackAbortControllerRef.current.abort();
            }

            const abortController = new AbortController();
            playbackAbortControllerRef.current = abortController;

            try {
                for (let i = 0; i < macro.keys.length; i++) {
                    if (abortController.signal.aborted) break;

                    const event = macro.keys[i];
                    const nextEvent = macro.keys[i + 1];

                    // 키 이벤트 시뮬레이션 (실제로 키보드 이벤트를 발생시킬 수 없으므로 콘솔에 출력)
                    const modifiers = [];
                    if (event.ctrl) modifiers.push("Ctrl");
                    if (event.shift) modifiers.push("Shift");
                    if (event.alt) modifiers.push("Alt");
                    if (event.meta) modifiers.push("Meta");

                    const keyDisplay =
                        modifiers.length > 0
                            ? `${modifiers.join("+")}+${event.key}`
                            : event.key;

                    console.log(
                        `[Playback ${event.timestamp}ms] ${keyDisplay}`
                    );

                    // 다음 키까지 대기
                    if (nextEvent) {
                        const delay = nextEvent.timestamp - event.timestamp;
                        await new Promise((resolve) =>
                            setTimeout(resolve, delay)
                        );
                    }
                }
            } finally {
                playbackAbortControllerRef.current = null;
            }
        },
        []
    );

    // 이벤트 리스너 등록
    useEffect(() => {
        if (isRecording) {
            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isRecording, handleKeyDown]);

    // 컴포넌트 언마운트 시 재생 중단
    useEffect(() => {
        return () => {
            if (playbackAbortControllerRef.current) {
                playbackAbortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        isRecording,
        recordedMacro,
        startRecording,
        stopRecording,
        clearRecording,
        playMacro,
    };
}
