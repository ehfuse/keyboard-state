import { useKeyboardState } from "../../../src/index";
import type { KeyboardState } from "../../../src/index";
import "./BasicExample.css";

export default function BasicExample() {
    const {
        capsLock,
        shift,
        ctrl,
        alt,
        meta,
        pressedKeys,
        lastPressedKey,
        isCtrlOrMeta,
    } = useKeyboardState() as KeyboardState;

    return (
        <div className="basic-example">
            <h2>기본 키보드 상태 감지</h2>
            <p>키보드의 수정자 키들을 눌러보세요!</p>

            <div className="modifier-keys">
                <div className={`key ${capsLock ? "active" : ""}`}>
                    <span className="key-name">Caps Lock</span>
                    <span className="key-status">
                        {capsLock ? "ON" : "OFF"}
                    </span>
                </div>

                <div className={`key ${shift ? "active" : ""}`}>
                    <span className="key-name">Shift</span>
                    <span className="key-status">
                        {shift ? "Pressed" : "Released"}
                    </span>
                </div>

                <div className={`key ${ctrl ? "active" : ""}`}>
                    <span className="key-name">Ctrl</span>
                    <span className="key-status">
                        {ctrl ? "Pressed" : "Released"}
                    </span>
                </div>

                <div className={`key ${alt ? "active" : ""}`}>
                    <span className="key-name">Alt</span>
                    <span className="key-status">
                        {alt ? "Pressed" : "Released"}
                    </span>
                </div>

                <div className={`key ${meta ? "active" : ""}`}>
                    <span className="key-name">Meta (Cmd/Win)</span>
                    <span className="key-status">
                        {meta ? "Pressed" : "Released"}
                    </span>
                </div>
            </div>

            <div className="info-section">
                <div className="info-item">
                    <strong>Ctrl or Meta (크로스 플랫폼):</strong>
                    <span className={isCtrlOrMeta ? "active" : ""}>
                        {isCtrlOrMeta ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="info-item">
                    <strong>마지막 눌린 키:</strong>
                    <span className="last-key">{lastPressedKey || "None"}</span>
                </div>

                <div className="info-item">
                    <strong>현재 눌려있는 키들:</strong>
                    <div className="pressed-keys">
                        {Array.from(pressedKeys).length > 0
                            ? Array.from(pressedKeys).join(", ")
                            : "None"}
                    </div>
                </div>
            </div>
        </div>
    );
}
