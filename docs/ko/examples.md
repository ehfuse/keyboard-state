# 예제 모음

다양한 실전 예제들입니다.

## 목차

-   [기본 예제](#기본-예제)
-   [단축키 예제](#단축키-예제)
-   [키 감시 예제](#키-감시-예제)
-   [Hold & Release 예제](#hold--release-예제)
-   [실전 예제](#실전-예제)

---

## 기본 예제

### 키보드 상태 표시

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function KeyboardStatus() {
    const keyboard = useKeyboardState();

    return (
        <div>
            <h2>키보드 상태</h2>
            <div>
                <strong>수정자 키:</strong>
                <ul>
                    <li>Caps Lock: {keyboard.capsLock ? "🟢 ON" : "⚪ OFF"}</li>
                    <li>Shift: {keyboard.shift ? "✅ 눌림" : "❌ 안눌림"}</li>
                    <li>Ctrl: {keyboard.ctrl ? "✅ 눌림" : "❌ 안눌림"}</li>
                    <li>Alt: {keyboard.alt ? "✅ 눌림" : "❌ 안눌림"}</li>
                    <li>Meta: {keyboard.meta ? "✅ 눌림" : "❌ 안눌림"}</li>
                </ul>
            </div>
            <div>
                <strong>마지막 키:</strong> {keyboard.lastPressedKey || "없음"}
            </div>
            <div>
                <strong>현재 눌린 키들:</strong>{" "}
                {keyboard.pressedKeys.size > 0
                    ? Array.from(keyboard.pressedKeys).join(", ")
                    : "없음"}
            </div>
        </div>
    );
}
```

### 크로스 플랫폼 단축키

Mac에서는 Cmd, Windows/Linux에서는 Ctrl이 자동으로 인식됩니다:

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function CrossPlatform() {
    const keyboard = useKeyboardState();

    useKeyboardState("ctrl+s", () => {
        console.log("저장 (Ctrl 또는 Cmd)");
    });

    return (
        <div>
            <p>단축키: {keyboard.meta ? "⌘" : "Ctrl"} + S</p>
            <p>상태: {keyboard.isCtrlOrMeta ? "✅ 눌림" : "❌ 안눌림"}</p>
        </div>
    );
}
```

---

## 단축키 예제

### 에디터 단축키

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function Editor() {
    const [content, setContent] = useState("");
    const [history, setHistory] = useState<string[]>([""]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const saveToHistory = (text: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(text);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    useKeyboardState({
        // 저장
        "ctrl+s": () => {
            console.log("저장:", content);
            alert("저장되었습니다!");
        },

        // 되돌리기
        "ctrl+z": () => {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setContent(history[newIndex]);
            }
        },

        // 다시실행
        "ctrl+shift+z": () => {
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setContent(history[newIndex]);
            }
        },

        // 모두 선택
        "ctrl+a": () => {
            document.execCommand("selectAll");
        },
    });

    return (
        <div>
            <h2>간단한 에디터</h2>
            <textarea
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    saveToHistory(e.target.value);
                }}
                style={{ width: "100%", height: "200px" }}
            />
            <div>
                <small>
                    Ctrl+S: 저장 | Ctrl+Z: 되돌리기 | Ctrl+Shift+Z: 다시실행 |
                    Ctrl+A: 모두 선택
                </small>
            </div>
        </div>
    );
}
```

### 게임 컨트롤

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function Game() {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const keyboard = useKeyboardState();

    // 방향키로 이동
    useKeyboardState({
        arrowup: () => setPosition((p) => ({ ...p, y: p.y - 10 })),
        arrowdown: () => setPosition((p) => ({ ...p, y: p.y + 10 })),
        arrowleft: () => setPosition((p) => ({ ...p, x: p.x - 10 })),
        arrowright: () => setPosition((p) => ({ ...p, x: p.x + 10 })),
    });

    // 스페이스로 점프
    useKeyboardState("space", () => {
        console.log("점프!");
    });

    return (
        <div>
            <h2>간단한 게임</h2>
            <div
                style={{
                    position: "relative",
                    width: "400px",
                    height: "400px",
                    border: "2px solid black",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: position.x,
                        top: position.y,
                        width: "20px",
                        height: "20px",
                        backgroundColor: "red",
                    }}
                />
            </div>
            <p>방향키로 이동, Space로 점프</p>
        </div>
    );
}
```

### Vim 스타일 단축키

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function VimNavigation() {
    useKeyboardState({
        // GitHub 스타일
        "g i": () => navigateTo("/issues"),
        "g p": () => navigateTo("/pulls"),
        "g h": () => navigateTo("/"),

        // Gmail 스타일
        "g a": () => navigateTo("/all"),
        "g s": () => navigateTo("/starred"),
        "g d": () => navigateTo("/drafts"),
    });

    const navigateTo = (path: string) => {
        console.log("이동:", path);
    };

    return (
        <div>
            <h2>Vim 스타일 네비게이션</h2>
            <ul>
                <li>
                    <kbd>g</kbd> <kbd>i</kbd>: Issues로 이동
                </li>
                <li>
                    <kbd>g</kbd> <kbd>p</kbd>: Pull Requests로 이동
                </li>
                <li>
                    <kbd>g</kbd> <kbd>h</kbd>: Home으로 이동
                </li>
            </ul>
        </div>
    );
}
```

---

## 키 감시 예제

### 특정 키 눌림 감지

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function KeyDetector() {
    const keyboard = useKeyboardState();

    const watchedKeys = [
        { name: "ESC", key: "Escape" },
        { name: "Enter", key: "Enter" },
        { name: "Space", key: "Space" },
        { name: "↑", key: "ArrowUp" },
        { name: "↓", key: "ArrowDown" },
    ];

    return (
        <div>
            <h2>키 감지기</h2>
            <div style={{ display: "flex", gap: "10px" }}>
                {watchedKeys.map(({ name, key }) => (
                    <div
                        key={name}
                        style={{
                            padding: "20px",
                            border: "2px solid",
                            borderColor: keyboard.isKeyPressed(key)
                                ? "green"
                                : "gray",
                            backgroundColor: keyboard.isKeyPressed(key)
                                ? "#e0ffe0"
                                : "white",
                        }}
                    >
                        <kbd>{name}</kbd>
                        <div>
                            {keyboard.isKeyPressed(key) ? "✅ 눌림" : "⚪"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 키 이벤트 감시

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function KeyEventLogger() {
    const [events, setEvents] = useState<string[]>([]);
    const keyboard = useKeyboardState();

    const addEvent = (event: string) => {
        setEvents((prev) => [event, ...prev.slice(0, 9)]);
    };

    // 여러 키를 감시
    keyboard.watchKey("Escape", () => addEvent("ESC 눌림"));
    keyboard.watchKey("Enter", () => addEvent("Enter 눌림"));
    keyboard.watchKey("Space", () => addEvent("Space 눌림"));

    // 또는 useKeyboardState()를 직접 사용할 수도 있습니다:
    // useKeyboardState("Escape", () => addEvent("ESC 눌림"));
    // useKeyboardState("Enter", () => addEvent("Enter 눌림"));
    // useKeyboardState("Space", () => addEvent("Space 눌림"));

    return (
        <div>
            <h2>키 이벤트 로거</h2>
            <p>ESC, Enter, Space를 눌러보세요</p>
            <ul>
                {events.map((event, i) => (
                    <li key={i}>{event}</li>
                ))}
            </ul>
        </div>
    );
}
```

---

## Hold & Release 예제

### 키 홀드 감지

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function HoldDetector() {
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (msg: string) => {
        setEvents((prev) => [
            `[${new Date().toLocaleTimeString()}] ${msg}`,
            ...prev.slice(0, 9),
        ]);
    };

    // Space - 1초 홀드
    useKeyboardState("Space", () => {}, {
        holdDuration: 1000,
        onHold: () => addEvent("🔥 Space 1초 홀드!"),
        onRelease: () => addEvent("↑ Space 릴리즈"),
    });

    // Enter - 2초 홀드
    useKeyboardState("Enter", () => {}, {
        holdDuration: 2000,
        onHold: () => addEvent("🔥 Enter 2초 홀드!"),
        onRelease: () => addEvent("↑ Enter 릴리즈"),
    });

    return (
        <div>
            <h2>키 홀드 감지</h2>
            <p>Space를 1초, Enter를 2초 눌러보세요</p>
            <ul>
                {events.map((event, i) => (
                    <li key={i}>{event}</li>
                ))}
            </ul>
        </div>
    );
}
```

### 릴리즈 이벤트

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function ReleaseExample() {
    const [isRecording, setIsRecording] = useState(false);

    useKeyboardState(
        "r",
        () => {
            setIsRecording(true);
            console.log("녹음 시작");
        },
        {
            onRelease: () => {
                setIsRecording(false);
                console.log("녹음 종료");
            },
        }
    );

    return (
        <div>
            <h2>릴리즈 이벤트</h2>
            <p>R 키를 누르고 있는 동안 녹음됩니다</p>
            <div
                style={{
                    padding: "20px",
                    backgroundColor: isRecording ? "red" : "gray",
                    color: "white",
                }}
            >
                {isRecording ? "🔴 녹음 중..." : "⏹️ 대기 중"}
            </div>
        </div>
    );
}
```

---

## 실전 예제

### 모달 단축키

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function ModalExample() {
    const [isOpen, setIsOpen] = useState(false);

    // ESC로 모달 닫기 (모달이 열려있을 때만)
    useKeyboardState("escape", () => setIsOpen(false), {
        enabled: isOpen,
    });

    // Ctrl+M으로 모달 열기
    useKeyboardState("ctrl+m", () => setIsOpen(true));

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>모달 열기 (Ctrl+M)</button>

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "40px",
                            borderRadius: "8px",
                        }}
                    >
                        <h2>모달</h2>
                        <p>ESC를 눌러 닫기</p>
                        <button onClick={() => setIsOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}
```

### 검색 단축키

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState, useRef, useEffect } from "react";

function SearchExample() {
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Ctrl+K로 검색 열기
    useKeyboardState(
        "ctrl+k",
        () => {
            setIsSearching(true);
        },
        { preventDefault: true }
    );

    // ESC로 검색 닫기
    useKeyboardState(
        "escape",
        () => {
            setIsSearching(false);
        },
        { enabled: isSearching }
    );

    useEffect(() => {
        if (isSearching) {
            inputRef.current?.focus();
        }
    }, [isSearching]);

    return (
        <div>
            <p>Ctrl+K를 눌러 검색을 열어보세요</p>

            {isSearching && (
                <div
                    style={{
                        position: "fixed",
                        top: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "500px",
                        padding: "20px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="검색... (ESC로 닫기)"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
```

### 탭 네비게이션

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function TabNavigation() {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ["홈", "프로필", "설정", "도움말"];

    useKeyboardState({
        // Ctrl+1~4로 탭 이동
        "ctrl+1": () => setActiveTab(0),
        "ctrl+2": () => setActiveTab(1),
        "ctrl+3": () => setActiveTab(2),
        "ctrl+4": () => setActiveTab(3),

        // 좌우 화살표로 탭 이동
        "ctrl+arrowleft": () =>
            setActiveTab((t) => (t > 0 ? t - 1 : tabs.length - 1)),
        "ctrl+arrowright": () =>
            setActiveTab((t) => (t < tabs.length - 1 ? t + 1 : 0)),
    });

    return (
        <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {tabs.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: activeTab === i ? "blue" : "gray",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {tab} (Ctrl+{i + 1})
                    </button>
                ))}
            </div>
            <div style={{ padding: "20px", border: "1px solid #ddd" }}>
                <h3>{tabs[activeTab]}</h3>
                <p>Ctrl+좌우 화살표로 탭 이동</p>
            </div>
        </div>
    );
}
```

---

## 관련 문서

-   [시작하기](./getting-started.md)
-   [API 레퍼런스](./api.md)
