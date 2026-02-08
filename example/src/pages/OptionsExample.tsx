import { useState } from "react";
import { useKeyboardState } from "../../../src/useKeyboardState";

export default function OptionsExample() {
    const [logs, setLogs] = useState<string[]>([]);
    const [enabled, setEnabled] = useState(true);

    const addLog = (message: string) => {
        setLogs((prev) =>
            [`${new Date().toLocaleTimeString()}: ${message}`, ...prev].slice(
                0,
                10,
            ),
        );
    };

    // 1. preventDefault 테스트 (명시적으로 true)
    useKeyboardState(
        "ctrl+s",
        () => {
            addLog("Ctrl+S pressed (preventDefault: true)");
        },
        { preventDefault: true },
    );

    // 2. preventDefault: false 테스트
    useKeyboardState(
        "ctrl+k",
        () => {
            addLog(
                "Ctrl+K pressed (preventDefault: false) - 브라우저 검색창이 열릴 수 있음",
            );
        },
        { preventDefault: false },
    );

    // 3. enabled 옵션 테스트 (동적으로 on/off)
    useKeyboardState(
        "ctrl+d",
        () => {
            addLog("Ctrl+D pressed (enabled: dynamic)");
        },
        { enabled },
    );

    // 4. classes 스코프 테스트
    useKeyboardState(
        "ctrl+e",
        () => {
            addLog("Ctrl+E pressed inside editor area (including input)");
        },
        {
            classes: ["editor-area"],
            allowInEditable: true,
            preventDefault: true,
        },
    );

    useKeyboardState(
        "ctrl+m",
        () => {
            addLog("Ctrl+M pressed inside modal (including input)");
        },
        { classes: ["modal-area"], allowInEditable: true },
    );

    // 5. 여러 옵션 조합
    useKeyboardState(
        "ctrl+shift+x",
        () => {
            addLog(
                "Ctrl+Shift+X pressed (preventDefault: false, enabled: dynamic)",
            );
        },
        { preventDefault: false, enabled },
    );

    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h1>Options Example</h1>

            <div style={{ marginBottom: "30px" }}>
                <h2>Controls</h2>
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                    Enable Ctrl+D and Ctrl+Shift+X
                </label>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                <div
                    className="editor-area"
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: "2px solid blue",
                        background: "#e3f2fd",
                        minHeight: "150px",
                    }}
                >
                    <h3>Editor Area (.editor-area)</h3>
                    <p>Ctrl+E works here (input 포함)</p>
                    <input
                        type="text"
                        placeholder="Focus here and press Ctrl+E"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div
                    className="modal-area"
                    style={{
                        flex: 1,
                        padding: "20px",
                        border: "2px solid purple",
                        background: "#f3e5f5",
                        minHeight: "150px",
                    }}
                >
                    <h3>Modal Area (.modal-area)</h3>
                    <p>Ctrl+M works here (input 포함)</p>
                    <input
                        type="text"
                        placeholder="Focus here and press Ctrl+M"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Shortcuts Reference</h2>
                <ul style={{ lineHeight: "1.8" }}>
                    <li>
                        <code>Ctrl+S</code> - preventDefault: true
                    </li>
                    <li>
                        <code>Ctrl+K</code> - preventDefault: false (브라우저
                        기본 동작 허용)
                    </li>
                    <li>
                        <code>Ctrl+D</code> - enabled 옵션 (체크박스로 제어)
                    </li>
                    <li>
                        <code>Ctrl+E</code> - classes: ['editor-area'] +
                        allowInEditable: true + preventDefault: true (파란 영역
                        input 포함)
                    </li>
                    <li>
                        <code>Ctrl+M</code> - classes: ['modal-area'] +
                        allowInEditable: true (보라 영역 input 포함)
                    </li>
                    <li>
                        <code>Ctrl+Shift+X</code> - preventDefault: false +
                        enabled 동적 제어
                    </li>
                </ul>
            </div>

            <div>
                <h2>Event Log</h2>
                <div
                    style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "4px",
                        maxHeight: "300px",
                        overflow: "auto",
                    }}
                >
                    {logs.length === 0 ? (
                        <p style={{ color: "#999" }}>
                            Press shortcuts to see logs...
                        </p>
                    ) : (
                        logs.map((log, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: "4px 0",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
