# 시작하기

`@ehfuse/keyboard-state`는 React 애플리케이션에서 키보드 상태 관리와 단축키 구현을 쉽게 만들어주는 라이브러리입니다.

## 설치

npm, yarn, 또는 pnpm을 사용하여 설치할 수 있습니다:

```bash
npm install @ehfuse/keyboard-state
```

```bash
yarn add @ehfuse/keyboard-state
```

```bash
pnpm add @ehfuse/keyboard-state
```

## 기본 개념

### 1. 전역 상태 관리

`@ehfuse/keyboard-state`는 [@ehfuse/forma](https://github.com/ehfuse/forma)를 사용하여 전역 키보드 상태를 관리합니다. `GlobalFormaProvider`로 앱을 감싼 후, 어떤 컴포넌트에서든 키보드 상태에 접근할 수 있습니다.

```tsx
import { GlobalFormaProvider } from "@ehfuse/forma";

function App() {
    return (
        <GlobalFormaProvider>
            <YourApp />
        </GlobalFormaProvider>
    );
}
```

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function Component1() {
    const keyboard = useKeyboardState();
    return <div>Shift: {keyboard.shift ? "ON" : "OFF"}</div>;
}

function Component2() {
    const keyboard = useKeyboardState();
    return <div>Ctrl: {keyboard.ctrl ? "ON" : "OFF"}</div>;
}

// 두 컴포넌트는 같은 키보드 상태를 공유합니다
```

### 2. 단일 훅으로 모든 것을

`useKeyboardState` 훅 하나로 다양한 작업을 수행할 수 있습니다:

```tsx
// 1. 상태만 구독
const keyboard = useKeyboardState();

// 2. 단일 단축키 등록
useKeyboardState("ctrl+s", () => console.log("저장"));

// 3. 여러 단축키 등록 (객체)
useKeyboardState({
    "ctrl+s": saveFn,
    "ctrl+z": undoFn,
    escape: closeFn,
});

// 4. 여러 단축키 등록 (배열, 옵션 포함)
useKeyboardState([
    { key: "ctrl+s", callback: saveFn, options: { preventDefault: true } },
    { key: "ctrl+z", callback: undoFn },
]);
```

## 첫 번째 예제

### 키보드 상태 표시하기

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function KeyboardStatus() {
    const keyboard = useKeyboardState();

    return (
        <div>
            <h2>키보드 상태</h2>
            <p>Caps Lock: {keyboard.capsLock ? "ON" : "OFF"}</p>
            <p>Shift: {keyboard.shift ? "눌림" : "안눌림"}</p>
            <p>Ctrl: {keyboard.ctrl ? "눌림" : "안눌림"}</p>
            <p>Alt: {keyboard.alt ? "눌림" : "안눌림"}</p>
            <p>Meta (Cmd/Win): {keyboard.meta ? "눌림" : "안눌림"}</p>
            <p>마지막 키: {keyboard.lastPressedKey || "없음"}</p>
            <p>
                눌려있는 키들:{" "}
                {keyboard.pressedKeys.size > 0
                    ? Array.from(keyboard.pressedKeys).join(", ")
                    : "없음"}
            </p>
        </div>
    );
}
```

### 단축키 등록하기

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";
import { useState } from "react";

function Editor() {
    const [content, setContent] = useState("");
    const [saved, setSaved] = useState(false);

    // Ctrl+S로 저장
    useKeyboardState(
        "ctrl+s",
        () => {
            console.log("저장:", content);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        },
        { preventDefault: true }
    );

    // ESC로 내용 지우기
    useKeyboardState("escape", () => {
        setContent("");
    });

    return (
        <div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ctrl+S로 저장, ESC로 지우기"
            />
            {saved && <p>저장됨!</p>}
        </div>
    );
}
```

### 크로스 플랫폼 단축키

Mac에서는 Cmd, Windows/Linux에서는 Ctrl을 사용하는 단축키를 쉽게 만들 수 있습니다:

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function CrossPlatformShortcuts() {
    const keyboard = useKeyboardState();

    // Ctrl+S 또는 Cmd+S
    useKeyboardState("ctrl+s", () => console.log("저장"), {
        preventDefault: true,
    });

    return (
        <div>
            <p>
                저장 단축키:{" "}
                {keyboard.isCtrlOrMeta ? "눌림 (Ctrl 또는 Cmd)" : "안눌림"}
            </p>
            <p>
                현재 플랫폼에서 {keyboard.meta ? "Cmd" : "Ctrl"} 키를 사용하세요
            </p>
        </div>
    );
}
```

## 주요 기능

### 1. 다양한 단축키 형식

```tsx
// 문자열
useKeyboardState("ctrl+s", callback);

// 배열
useKeyboardState(["ctrl", "s"], callback);

// 객체
useKeyboardState({ ctrl: true, key: "s" }, callback);

// 여러 단축키 (객체)
useKeyboardState({
    "ctrl+s": saveFn,
    "ctrl+z": undoFn,
});

// 여러 단축키 (배열)
useKeyboardState([
    { key: "ctrl+s", callback: saveFn },
    { key: "ctrl+z", callback: undoFn },
]);
```

### 2. 키 시퀀스 (연속 입력)

```tsx
// Vim 스타일 키 시퀀스
useKeyboardState({
    "g i": () => console.log("이슈로 이동"),
    "g h": () => console.log("홈으로 이동"),
    "g p": () => console.log("PR로 이동"),
});
```

### 3. Hold & Release

```tsx
useKeyboardState(
    "space",
    () => {
        // holdDuration이 있으면 일반 콜백은 실행 안됨
    },
    {
        holdDuration: 1000, // 1초
        onHold: () => console.log("Space 1초 홀드!"),
        onRelease: () => console.log("Space 떼짐!"),
    }
);
```

### 4. 특정 키 감지

```tsx
import { useKeyboardState, Keys } from "@ehfuse/keyboard-state";

function KeyWatcher() {
    const keyboard = useKeyboardState();

    // 특정 키 눌림 여부 확인
    const isEscPressed = keyboard.isKeyPressed(Keys.Escape);
    const isEnterPressed = keyboard.isKeyPressed(Keys.Enter);

    // 여러 키 중 하나라도 눌렸는지 확인
    const isArrowPressed = keyboard.isKeyPressed([
        Keys.ArrowUp,
        Keys.ArrowDown,
        Keys.ArrowLeft,
        Keys.ArrowRight,
    ]);

    return (
        <div>
            <p>ESC: {isEscPressed ? "눌림" : "안눌림"}</p>
            <p>Enter: {isEnterPressed ? "눌림" : "안눌림"}</p>
            <p>방향키: {isArrowPressed ? "눌림" : "안눌림"}</p>
        </div>
    );
}
```

### 5. 동적으로 키 감시

```tsx
import { useKeyboardState, Keys } from "@ehfuse/keyboard-state";

function KeyWatcher() {
    const keyboard = useKeyboardState();

    // ESC 키를 감시
    keyboard.watchKey(Keys.Escape, () => {
        console.log("ESC 눌림!");
    });

    return <div>ESC 키를 눌러보세요</div>;
}
```

## 다음 단계

-   [API 레퍼런스](./api.md) - 모든 API의 상세 문서
-   [예제 모음](./examples.md) - 다양한 사용 예제

## 자주 묻는 질문

### Provider가 필요한가요?

네. `@ehfuse/keyboard-state`는 [@ehfuse/forma](https://github.com/ehfuse/forma)를 사용하므로 앱을 `GlobalFormaProvider`로 감싸야 합니다:

```tsx
import { GlobalFormaProvider } from "@ehfuse/forma";

<GlobalFormaProvider>
    <App />
</GlobalFormaProvider>;
```

### 성능은 어떤가요?

매우 뛰어납니다. 키보드 상태를 구독하는 컴포넌트만 리렌더링되며, 단축키만 등록한 컴포넌트는 리렌더링되지 않습니다.

### TypeScript를 지원하나요?

네, 완전한 타입 정의를 제공합니다.

### SSR을 지원하나요?

네, 서버 사이드에서는 키보드 이벤트가 발생하지 않으므로 안전하게 동작합니다.
