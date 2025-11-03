import { useKeyboardState, Keys } from "../../../src/index";
import type { KeyboardState } from "../../../src/index";
import { useState, useEffect } from "react";
import "./KeyWatchExample.css";

export default function KeyWatchExample() {
    const [keyEvents, setKeyEvents] = useState<string[]>([]);

    const addKeyEvent = (event: string) => {
        setKeyEvents((prev) => [event, ...prev.slice(0, 19)]); // 최근 20개만 유지
    };

    // 키보드 상태 구독
    const keyboard = useKeyboardState() as KeyboardState;

    // 각 키를 감시 - useEffect 안에서 호출
    useEffect(() => {
        const cleanups = [
            keyboard.watchKey(Keys.Escape, () => {
                addKeyEvent("🚪 ESC: Escape pressed - Could close modal");
            }),
            keyboard.watchKey(Keys.Enter, () => {
                addKeyEvent("✅ Enter: Submit action triggered");
            }),
            keyboard.watchKey(Keys.Space, () => {
                addKeyEvent("⎵ Space: Play/Pause or action triggered");
            }),
            keyboard.watchKey(Keys.ArrowUp, () => {
                addKeyEvent("⬆️ Arrow Up: Navigate up");
            }),
            keyboard.watchKey(Keys.ArrowDown, () => {
                addKeyEvent("⬇️ Arrow Down: Navigate down");
            }),
            keyboard.watchKey(Keys.ArrowLeft, () => {
                addKeyEvent("⬅️ Arrow Left: Navigate left");
            }),
            keyboard.watchKey(Keys.ArrowRight, () => {
                addKeyEvent("➡️ Arrow Right: Navigate right");
            }),
            keyboard.watchKey(Keys.Tab, () => {
                addKeyEvent("⭾ Tab: Focus next element");
            }),
            keyboard.watchKey(Keys.Delete, () => {
                addKeyEvent("🗑️ Delete: Delete action triggered");
            }),
            keyboard.watchKey(Keys.Backspace, () => {
                addKeyEvent("⌫ Backspace: Delete previous character");
            }),
            keyboard.watchKey(Keys.Control, () => {
                addKeyEvent("⌃ Ctrl: Control key detected");
            }),
        ];

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, [keyboard]);

    const clearEvents = () => {
        setKeyEvents([]);
    };

    // 표시할 키: [표시명, 실제 키 값]
    const watchedKeysMap: [string, string][] = [
        ["Escape", Keys.Escape],
        ["Enter", Keys.Enter],
        ["Space", " "],
        ["↑", Keys.ArrowUp],
        ["↓", Keys.ArrowDown],
        ["←", Keys.ArrowLeft],
        ["→", Keys.ArrowRight],
        ["Tab", Keys.Tab],
        ["Delete", Keys.Delete],
        ["Backspace", Keys.Backspace],
        ["Ctrl", Keys.Control],
    ];

    // 각 키의 눌림 상태 확인
    const isEscapePressed = keyboard.isKeyPressed(Keys.Escape);
    const isEnterPressed = keyboard.isKeyPressed(Keys.Enter);
    const isSpacePressed = keyboard.isKeyPressed(" ");
    const isArrowUpPressed = keyboard.isKeyPressed(Keys.ArrowUp);
    const isArrowDownPressed = keyboard.isKeyPressed(Keys.ArrowDown);
    const isArrowLeftPressed = keyboard.isKeyPressed(Keys.ArrowLeft);
    const isArrowRightPressed = keyboard.isKeyPressed(Keys.ArrowRight);
    const isTabPressed = keyboard.isKeyPressed(Keys.Tab);
    const isDeletePressed = keyboard.isKeyPressed(Keys.Delete);
    const isBackspacePressed = keyboard.isKeyPressed(Keys.Backspace);
    const isControlPressed = keyboard.isKeyPressed(Keys.Control);

    const keyPressedStates: Record<string, boolean> = {
        [Keys.Escape]: isEscapePressed,
        [Keys.Enter]: isEnterPressed,
        " ": isSpacePressed,
        [Keys.ArrowUp]: isArrowUpPressed,
        [Keys.ArrowDown]: isArrowDownPressed,
        [Keys.ArrowLeft]: isArrowLeftPressed,
        [Keys.ArrowRight]: isArrowRightPressed,
        [Keys.Tab]: isTabPressed,
        [Keys.Delete]: isDeletePressed,
        [Keys.Backspace]: isBackspacePressed,
        [Keys.Control]: isControlPressed,
    };

    return (
        <div className="key-watch-example">
            <h2>특정 키 감시 예제</h2>
            <p>다음 키들을 눌러보세요. 각 키에 대한 액션이 실행됩니다:</p>

            <div className="watched-keys">
                {watchedKeysMap.map(([displayName, keyValue]) => {
                    const isPressed = keyPressedStates[keyValue];

                    return (
                        <div
                            key={displayName}
                            className={`watched-key ${
                                isPressed ? "pressed" : ""
                            }`}
                        >
                            <kbd>{displayName}</kbd>
                            <span className="key-status">
                                {isPressed ? "Pressed" : "Released"}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="events-section">
                <div className="events-header">
                    <h3>키 이벤트 로그</h3>
                    <button onClick={clearEvents} className="clear-btn">
                        Clear Events
                    </button>
                </div>
                <div className="events-list">
                    {keyEvents.length === 0 ? (
                        <div className="no-events">
                            감시 중인 키를 눌러보세요!
                        </div>
                    ) : (
                        keyEvents.map((event, index) => (
                            <div key={index} className="event-item">
                                <span className="timestamp">
                                    {new Date().toLocaleTimeString()}
                                </span>
                                <span className="event-text">{event}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="usage-tip">
                <h4>💡 사용 팁</h4>
                <ul>
                    <li>
                        <strong>ESC</strong>: 모달이나 다이얼로그 닫기
                    </li>
                    <li>
                        <strong>Enter</strong>: 폼 제출이나 액션 실행
                    </li>
                    <li>
                        <strong>Space</strong>: 동영상 재생/정지, 버튼 클릭
                    </li>
                    <li>
                        <strong>화살표 키</strong>: 목록 탐색이나 포커스 이동
                    </li>
                    <li>
                        <strong>Tab</strong>: 폼 요소 간 포커스 이동
                    </li>
                    <li>
                        <strong>Delete/Backspace</strong>: 콘텐츠 삭제
                    </li>
                    <li>
                        <strong>Ctrl</strong>: 단독 또는 조합키로 사용
                    </li>
                </ul>
            </div>
        </div>
    );
}
