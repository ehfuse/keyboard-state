# Getting Started

## Installation

```bash
npm install @ehfuse/keyboard-state
```

## Setup

`@ehfuse/keyboard-state` uses [@ehfuse/forma](https://github.com/ehfuse/forma) for global state management. You need to wrap your app with `GlobalFormaProvider`:

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

## Basic Usage

### 1. Subscribing to Keyboard State

Subscribe to keyboard state to track modifier keys and pressed keys:

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function App() {
    const keyboard = useKeyboardState();

    return (
        <div>
            <p>Shift: {keyboard.shift ? "Pressed" : "Released"}</p>
            <p>Ctrl: {keyboard.ctrl ? "Pressed" : "Released"}</p>
            <p>Alt: {keyboard.alt ? "Pressed" : "Released"}</p>
            <p>
                Pressed Keys:{" "}
                {Array.from(keyboard.pressedKeys).join(", ") || "None"}
            </p>
        </div>
    );
}
```

### 2. Registering Keyboard Shortcuts

Register shortcuts to execute callbacks when specific key combinations are pressed:

```tsx
import { useKeyboardState } from "@ehfuse/keyboard-state";

function Editor() {
    useKeyboardState("ctrl+s", () => {
        console.log("Save!");
    });

    useKeyboardState("ctrl+z", () => {
        console.log("Undo!");
    });

    return <textarea />;
}
```

### 3. Multiple Registration Methods

**Method 1: Object** (Recommended for multiple shortcuts)

```tsx
useKeyboardState({
    "ctrl+s": () => console.log("Save"),
    "ctrl+z": () => console.log("Undo"),
    escape: () => console.log("Close"),
});
```

**Method 2: Array with Options**

```tsx
useKeyboardState([
    {
        key: "ctrl+s",
        callback: () => console.log("Save"),
        options: { preventDefault: true },
    },
    {
        key: "escape",
        callback: () => console.log("Close"),
    },
]);
```

**Method 3: Array Format**

```tsx
useKeyboardState(["ctrl", "s"], () => {
    console.log("Ctrl+S");
});
```

## Key Combination Formats

### String Format (Recommended)

```tsx
"ctrl+s"; // Ctrl + S
"ctrl+shift+p"; // Ctrl + Shift + P
"escape"; // ESC
"g i"; // g then i (sequence)
"ctrl+arrowup"; // Ctrl + Up Arrow
```

### Array Format

```tsx
["ctrl", "s"][("ctrl", "shift", "p")]; // Ctrl + S // Ctrl + Shift + P
```

### Object Format

```tsx
{ ctrl: true, key: "s" }                    // Ctrl + S
{ ctrl: true, shift: true, key: "p" }       // Ctrl + Shift + P
```

## Advanced Features

### 1. Hold & Release Detection

```tsx
useKeyboardState("space", () => {}, {
    holdDuration: 1000,
    onHold: () => console.log("Held for 1 second!"),
    onRelease: () => console.log("Released!"),
});
```

### 2. Conditional Activation

```tsx
const [editorMode, setEditorMode] = useState(false);

useKeyboardState("ctrl+s", saveFn, {
    enabled: editorMode, // Only active in editor mode
});
```

### 3. Scope Restriction

```tsx
useKeyboardState("escape", closeFn, {
    classes: ["modal", "dialog"], // Only works inside .modal or .dialog
});
```

### 4. Key Sequences (Vim-style)

```tsx
useKeyboardState({
    "g i": () => console.log("Go to issues"),
    "g h": () => console.log("Go to home"),
});
```

### 5. Dynamic Shortcuts

```tsx
const keyboard = useKeyboardState();

useEffect(() => {
    if (isModalOpen) {
        const cleanup = keyboard.watchKey("escape", closeModal);
        return cleanup; // Cleanup when modal closes
    }
}, [isModalOpen, keyboard]);
```

## Type-Safe Keys

Use the `Keys` enum for autocompletion:

```tsx
import { useKeyboardState, Keys } from "@ehfuse/keyboard-state";

function App() {
    useKeyboardState(Keys.Escape, () => {
        console.log("ESC pressed");
    });

    const keyboard = useKeyboardState();
    const isEscPressed = keyboard.isKeyPressed(Keys.Escape);

    return <div>ESC: {isEscPressed ? "Pressed" : "Released"}</div>;
}
```

## Next Steps

-   [API Reference](./api.md) - Complete API documentation
-   [Examples](./examples.md) - More examples and use cases
