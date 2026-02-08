# @ehfuse/keyboard-state

⌨️ React Keyboard State Management and Shortcuts Library

React 키보드 상태 관리 및 단축키 라이브러리

## Features

- 🎯 **Global Keyboard State Management** - Manage key inputs and modifier key states globally
- ⚡ **Performance Optimized** - Only necessary components re-render
- 🔥 **Shortcut Registration** - Easy shortcut registration and management
- 🎮 **Hold & Release** - Key hold detection and release event support
- 📝 **Key Sequences** - Vim-style sequential key input support (`g i`, `g h`)
- 🎬 **Key Recording** - Record and playback key inputs
- 🌐 **Global State** - Share global state without Provider
- 📦 **TypeScript Support** - Full type safety
- 🪶 **Lightweight** - Minimal bundle size

## 특징

- 🎯 **전역 키보드 상태 관리** - 키 입력, 수정자 키 상태를 전역으로 관리
- ⚡ **성능 최적화** - 필요한 컴포넌트만 리렌더링
- 🔥 **단축키 등록** - 간편한 단축키 등록 및 관리
- 🎮 **Hold & Release** - 키 홀드 감지 및 릴리즈 이벤트 지원
- 📝 **키 시퀀스** - Vim 스타일 연속 키 입력 지원 (`g i`, `g h`)
- 🎬 **키 녹화** - 키 입력 녹화 및 재생
- 🌐 **글로벌 상태** - Provider 없이 전역 상태 공유
- 📦 **TypeScript 지원** - 완전한 타입 안전성
- 🪶 **경량** - 최소한의 번들 사이즈

## 설치

```bash
npm install @ehfuse/keyboard-state
# 또는
yarn add @ehfuse/keyboard-state
# 또는
pnpm add @ehfuse/keyboard-state
```

## 빠른 시작 | Quick Start

### 기본 사용법 | Basic Usage

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function App() {
    // Register Ctrl+S shortcut
    useKeyboardState("ctrl+s", () => {
        console.log("Saved!");
    });

    return <div>App content</div>;
}
```

### 키보드 상태 구독 | Keyboard State Subscription

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function KeyboardStatus() {
    const keyboard = useKeyboardState();

    return (
        <div>
            <p>Shift: {keyboard.shift ? "Pressed" : "Released"}</p>
            <p>Ctrl: {keyboard.ctrl ? "Pressed" : "Released"}</p>
            <p>Last key: {keyboard.lastPressedKey}</p>
        </div>
    );
}
```

### 여러 단축키 등록 | Multiple Shortcuts

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function Editor() {
    // Object syntax
    useKeyboardState({
        "ctrl+s": handleSave,
        "ctrl+z": handleUndo,
        "ctrl+shift+z": handleRedo,
        escape: handleEscape,
    });

    // Or array syntax (with options)
    useKeyboardState([
        {
            key: "ctrl+s",
            callback: handleSave,
            options: { holdDuration: 1000 },
        },
        { key: "ctrl+z", callback: handleUndo },
    ]);

    return <div>Editor content</div>;
}
```

### 홀드 & 릴리즈 | Hold & Release

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function HoldExample() {
    useKeyboardState("shift", () => {}, {
        holdDuration: 1500, // 1.5 seconds
        onHold: () => console.log("Shift held for 1.5s!"),
        onRelease: () => console.log("Shift released!"),
    });

    return <div>Hold Shift key for 1.5 seconds</div>;
}
```

### 키 시퀀스 | Key Sequences (Vim Style)

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function VimLikeEditor() {
    useKeyboardState({
        "g i": () => console.log("Go to issue"),
        "g h": () => console.log("Go to home"),
    });

    return <div>Type g + i or g + h</div>;
}
```

## API

### `useKeyboardState`

키보드 상태 관리 및 단축키 등록을 위한 메인 훅

```tsx
// 1. State only
const keyboard = useKeyboardState();

// 2. Single shortcut
useKeyboardState("ctrl+s", () => console.log("Saved"));

// 3. Multiple shortcuts (object)
useKeyboardState({
    "ctrl+s": saveFn,
    "ctrl+z": undoFn,
});

// 4. Multiple shortcuts (array with options)
useKeyboardState([
    { key: "ctrl+s", callback: saveFn, options: { preventDefault: true } },
]);
```

### 반환 타입 | Return Types

#### `KeyboardState`

```tsx
interface KeyboardState {
    // Basic state
    capsLock: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    pressedKeys: Set<string>;
    lastPressedKey: string | null;

    // Helper
    isCtrlOrMeta: boolean;

    // Methods
    watchKey: (key, callback, options?) => () => void;
    isKeyPressed: (key) => boolean;
}
```

#### `KeyComboOptions`

```tsx
interface KeyComboOptions {
    preventDefault?: boolean; // Prevent default behavior (default: false)
    allowInEditable?: boolean; // Allow in input/textarea/contenteditable (default: false)
    enabled?: boolean; // Enable/disable shortcut (default: true)
    classes?: string[]; // Only work within specific classes
    holdDuration?: number; // Hold duration in milliseconds
    onHold?: () => void; // Callback when held
    onRelease?: () => void; // Callback when released
}
```

## 문서 | Documentation

- 📚 [시작하기](./docs/ko/getting-started.md)
- 📖 [API 레퍼런스](./docs/ko/api.md)
- 💡 [예제 모음](./docs/ko/examples.md)

## 라이선스 | License

MIT © [ehfuse](https://github.com/ehfuse)

## 관련 프로젝트 | Related Projects

- [@ehfuse/forma](https://github.com/ehfuse/forma) - React 상태 관리 라이브러리
