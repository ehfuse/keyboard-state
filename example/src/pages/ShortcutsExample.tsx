import { useKeyboardState } from "../../../src/index";
import { useState } from "react";
import "./ShortcutsExample.css";

export default function ShortcutsExample() {
    const [messages, setMessages] = useState<string[]>([]);
    const keyboard = useKeyboardState()!; // 상태 구독용

    const addMessage = (message: string) => {
        setMessages((prev) => [message, ...prev.slice(0, 9)]); // 최근 10개만 유지
    };

    // 키 조합이 현재 눌려있는지 확인 (정확히 일치하는지)
    const isComboActive = (keys: string[]) => {
        if (!keyboard) return false;

        // 수정자 키 체크
        const hasCtrl = keys.some((k) => k.toLowerCase() === "ctrl");
        const hasShift = keys.some((k) => k.toLowerCase() === "shift");
        const hasAlt = keys.some((k) => k.toLowerCase() === "alt");
        const hasMeta = keys.some((k) => k.toLowerCase() === "meta");

        // 실제 수정자 키 상태와 일치하는지 확인
        if (hasCtrl !== keyboard.ctrl) return false;
        if (hasShift !== keyboard.shift) return false;
        if (hasAlt !== keyboard.alt) return false;
        if (hasMeta !== keyboard.meta) return false;

        // 일반 키들이 모두 눌려있는지 확인
        return keys.every((key) => {
            const normalizedKey = key.toLowerCase();
            if (["ctrl", "shift", "alt", "meta"].includes(normalizedKey)) {
                return true; // 수정자 키는 이미 위에서 체크했음
            }
            return keyboard.isKeyPressed(normalizedKey);
        });
    };

    // 🎉 다양한 방식으로 키보드 단축키 등록 가능!

    // 방식 1: 배열로 여러 단축키 한 번에 등록
    useKeyboardState([
        {
            key: "ctrl+s",
            callback: () => addMessage("💾 [문자열] Ctrl+S: Save!"),
        },
        {
            key: "ctrl+shift+z",
            callback: () => addMessage("↷ [문자열] Ctrl+Shift+Z: Redo!"),
        },
        {
            key: "alt+enter",
            callback: () => addMessage("🛋️ [문자열] Alt+Enter: Fullscreen!"),
        },
    ]);

    // 방식 2: 단일 단축키 등록 (문자열)
    useKeyboardState("ctrl+c", () => addMessage("📋 Ctrl+C: Copy!"));
    useKeyboardState("ctrl+v", () => addMessage("📄 Ctrl+V: Paste!"));
    useKeyboardState("ctrl+shift+p", () =>
        addMessage("🎨 Ctrl+Shift+P: Palette!")
    );

    // 방식 3: 단일 단축키 등록 (배열)
    useKeyboardState(["ctrl", "z"], () => addMessage("↶ Ctrl+Z: Undo!"));
    useKeyboardState(["ctrl", "k"], () => addMessage("🔍 Ctrl+K: Search!"));

    // 방식 4: 객체로 여러 단축키 한 번에 등록
    useKeyboardState({
        escape: () => addMessage("❌ ESC: Cancel!"),
        arrowup: () => addMessage("⬆️ Arrow Up!"),
        arrowdown: () => addMessage("⬇️ Arrow Down!"),
        arrowleft: () => addMessage("⬅️ Arrow Left!"),
        arrowright: () => addMessage("➡️ Arrow Right!"),
        "ctrl+arrowup": () => addMessage("⬆️ Ctrl+↑: Top!"),
        "ctrl+arrowdown": () => addMessage("⬇️ Ctrl+↓: Bottom!"),
        "ctrl+arrowleft": () => addMessage("⬅️ Ctrl+←: Start!"),
        "ctrl+arrowright": () => addMessage("➡️ Ctrl+→: End!"),
    });

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="shortcuts-example">
            <h2>키보드 단축키 등록 예제</h2>
            <p>다음 키 조합들을 눌러보세요:</p>

            <div className="shortcuts-grid">
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "s"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>S</kbd>
                    <span>저장</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "c"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>C</kbd>
                    <span>복사</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "v"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>V</kbd>
                    <span>붙여넣기</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "z"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>Z</kbd>
                    <span>되돌리기</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "shift", "z"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
                    <span>다시실행</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "k"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    <span>명령 검색</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "shift", "p"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
                    <span>명령 팔레트</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["alt", "enter"]) ? "active" : ""
                    }`}
                >
                    <kbd>Alt</kbd> + <kbd>Enter</kbd>
                    <span>전체화면</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["escape"]) ? "active" : ""
                    }`}
                >
                    <kbd>ESC</kbd>
                    <span>취소/닫기</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["arrowup"]) ? "active" : ""
                    }`}
                >
                    <kbd>↑</kbd>
                    <span>위로 이동</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["arrowdown"]) ? "active" : ""
                    }`}
                >
                    <kbd>↓</kbd>
                    <span>아래로 이동</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["arrowleft"]) ? "active" : ""
                    }`}
                >
                    <kbd>←</kbd>
                    <span>왼쪽으로 이동</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["arrowright"]) ? "active" : ""
                    }`}
                >
                    <kbd>→</kbd>
                    <span>오른쪽으로 이동</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "arrowup"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>↑</kbd>
                    <span>맨 위로</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "arrowdown"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>↓</kbd>
                    <span>맨 아래로</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "arrowleft"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>←</kbd>
                    <span>맨 처음으로</span>
                </div>
                <div
                    className={`shortcut-item ${
                        isComboActive(["ctrl", "arrowright"]) ? "active" : ""
                    }`}
                >
                    <kbd>Ctrl</kbd> + <kbd>→</kbd>
                    <span>맨 끝으로</span>
                </div>
            </div>

            <div className="messages-section">
                <div className="messages-header">
                    <h3>실행된 액션들</h3>
                    <button onClick={clearMessages} className="clear-btn">
                        Clear
                    </button>
                </div>
                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="no-messages">키 조합을 눌러보세요!</div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index} className="message-item">
                                {message}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
