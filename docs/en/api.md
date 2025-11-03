# API Reference

## Table of Contents

-   [Hooks](#hooks)
    -   [useKeyboardState](#usekeyboardstate)
    -   [useKeyboardRecording](#usekeyboardrecording)
-   [Types](#types)
    -   [KeyboardState](#keyboardstate)
    -   [KeyComboOptions](#keycombooptions)
    -   [Keys](#keys)
    -   [RecordedMacro](#recordedmacro)
-   [Utilities](#utilities)
    -   [KeyComboInput](#keycomboinput)
    -   [KeyType](#keytype)

---

## Hooks

### useKeyboardState

Main hook for managing keyboard state and registering shortcuts.

#### Usage 1: Subscribe to State

```tsx
const keyboard = useKeyboardState();
```

**Returns**: [`KeyboardState`](#keyboardstate)

#### Usage 2: Register Single Shortcut

```tsx
useKeyboardState(combo, callback, options?);
```

**Returns**: `void`

#### Usage 3: Register Multiple Shortcuts (Object)

```tsx
useKeyboardState({
    "ctrl+s": saveFn,
    escape: closeFn,
});
```

**Returns**: `void`

#### Usage 4: Register Multiple Shortcuts (Array)

```tsx
useKeyboardState([
    { key: "ctrl+s", callback: saveFn, options: { preventDefault: true } },
    { key: "escape", callback: closeFn },
]);
```

**Returns**: `void`

#### Parameters

| Name       | Type                                             | Description                              |
| ---------- | ------------------------------------------------ | ---------------------------------------- |
| `combo`    | [`KeyComboInput`](#keycomboinput) (optional)     | Key combination string, array, or object |
| `callback` | `() => void` (optional)                          | Function to execute when key is pressed  |
| `options`  | [`KeyComboOptions`](#keycombooptions) (optional) | Shortcut behavior options                |

#### Key Combination Formats

**String Format** (Recommended):

```tsx
"ctrl+s"; // Ctrl + S
"ctrl+shift+p"; // Ctrl + Shift + P
"escape"; // ESC
"g i"; // g then i (sequence)
"ctrl+arrowup"; // Ctrl + Up Arrow
```

**Array Format**:

```tsx
["ctrl", "s"][("ctrl", "shift", "p")]; // Ctrl + S // Ctrl + Shift + P
```

**Object Format**:

```tsx
{ ctrl: true, key: "s" }                    // Ctrl + S
{ ctrl: true, shift: true, key: "p" }       // Ctrl + Shift + P
```

#### Examples

**Basic Usage**:

```tsx
function App() {
    // Subscribe to state only
    const keyboard = useKeyboardState();

    return <div>Shift: {keyboard.shift ? "ON" : "OFF"}</div>;
}
```

**Single Shortcut**:

```tsx
function Editor() {
    useKeyboardState("ctrl+s", () => {
        console.log("Save!");
    });

    return <textarea />;
}
```

**Multiple Shortcuts (Object)**:

```tsx
function App() {
    useKeyboardState({
        "ctrl+s": () => console.log("Save"),
        "ctrl+z": () => console.log("Undo"),
        escape: () => console.log("Cancel"),
    });

    return <div>App Content</div>;
}
```

**Multiple Shortcuts (Array with Options)**:

```tsx
function App() {
    useKeyboardState([
        {
            key: "ctrl+s",
            callback: () => console.log("Save"),
            options: { holdDuration: 1000 },
        },
        {
            key: "ctrl+z",
            callback: () => console.log("Undo"),
        },
    ]);

    return <div>App Content</div>;
}
```

**Key Sequences**:

```tsx
function VimEditor() {
    useKeyboardState({
        "g i": () => console.log("Go to issues"),
        "g h": () => console.log("Go to home"),
    });

    return <div>Vim-style Editor</div>;
}
```

**Hold & Release**:

```tsx
function HoldExample() {
    useKeyboardState("space", () => {}, {
        holdDuration: 1000,
        onHold: () => console.log("Held for 1 second!"),
        onRelease: () => console.log("Released!"),
    });

    return <div>Hold Space for 1 second</div>;
}
```

---

### useKeyboardRecording

Hook for recording and playing back keyboard input as macros.

#### Usage

```tsx
import {
    useKeyboardRecording,
    type KeyboardRecording,
} from "@ehfuse/keyboard-state";

const recording: KeyboardRecording = useKeyboardRecording();

// Or with destructuring
const {
    isRecording,
    recordedMacro,
    startRecording,
    stopRecording,
    clearRecording,
    playMacro,
} = useKeyboardRecording();
```

#### Return Value

| Property         | Type                                        | Description                     |
| ---------------- | ------------------------------------------- | ------------------------------- |
| `isRecording`    | `boolean`                                   | Whether currently recording     |
| `recordedMacro`  | [`RecordedMacro`](#recordedmacro) \| `null` | Recorded macro data             |
| `startRecording` | `() => void`                                | Start recording                 |
| `stopRecording`  | `() => RecordedMacro \| null`               | Stop recording and return macro |
| `clearRecording` | `() => void`                                | Clear recorded data             |
| `playMacro`      | `(macro: RecordedMacro) => Promise<void>`   | Play recorded macro with timing |

#### Examples

**Basic Recording & Playback**:

```tsx
function MacroRecorder() {
    const {
        isRecording,
        recordedMacro,
        startRecording,
        stopRecording,
        playMacro,
    } = useKeyboardRecording();

    return (
        <div>
            <button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </button>
            <button
                onClick={() => recordedMacro && playMacro(recordedMacro)}
                disabled={!recordedMacro || isRecording}
            >
                Play
            </button>

            {isRecording && <p>🔴 Recording...</p>}
            {recordedMacro && (
                <p>
                    Recorded: {recordedMacro.keys.length} keys,
                    {recordedMacro.duration}ms
                </p>
            )}
        </div>
    );
}
```

**Save & Load Macros**:

```tsx
function MacroManager() {
    const { recordedMacro, playMacro } = useKeyboardRecording();
    const [savedMacros, setSavedMacros] = useState<RecordedMacro[]>([]);

    const saveMacro = () => {
        if (recordedMacro) {
            setSavedMacros([...savedMacros, recordedMacro]);
        }
    };

    return (
        <div>
            <button onClick={saveMacro}>Save Current Macro</button>
            <ul>
                {savedMacros.map((macro, index) => (
                    <li key={index}>
                        <button onClick={() => playMacro(macro)}>
                            Macro {index + 1} ({macro.keys.length} keys)
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

**JSON Persistence**:

```tsx
function MacroPersistence() {
    const { recordedMacro, playMacro } = useKeyboardRecording();

    const exportMacro = () => {
        if (recordedMacro) {
            const json = JSON.stringify(recordedMacro);
            localStorage.setItem("macro", json);
        }
    };

    const importMacro = () => {
        const json = localStorage.getItem("macro");
        if (json) {
            const macro = JSON.parse(json) as RecordedMacro;
            playMacro(macro);
        }
    };

    return (
        <div>
            <button onClick={exportMacro}>Export Macro</button>
            <button onClick={importMacro}>Import Macro</button>
        </div>
    );
}
```

---

## Types

### KeyboardState

Type returned by `useKeyboardState()`.

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

    // Helper properties
    isCtrlOrMeta: boolean;

    // Methods
    watchKey: (
        key: KeyComboInput,
        callback: () => void,
        options?: KeyComboOptions
    ) => () => void;
    isKeyPressed: (key: KeyType | KeyType[]) => boolean;
}
```

#### Properties

| Property         | Type             | Description                                      |
| ---------------- | ---------------- | ------------------------------------------------ |
| `capsLock`       | `boolean`        | Caps Lock state                                  |
| `shift`          | `boolean`        | Shift key pressed state                          |
| `ctrl`           | `boolean`        | Ctrl key pressed state                           |
| `alt`            | `boolean`        | Alt key pressed state                            |
| `meta`           | `boolean`        | Meta key (Cmd/Win) pressed state                 |
| `pressedKeys`    | `Set<string>`    | All currently pressed keys                       |
| `lastPressedKey` | `string \| null` | Last pressed key                                 |
| `isCtrlOrMeta`   | `boolean`        | True if Ctrl or Meta is pressed (cross-platform) |

#### Methods

##### watchKey

Dynamically watch for key combinations.

```tsx
const cleanup = keyboard.watchKey(key, callback, options?);
```

**Parameters**:

-   `key`: Key combination to watch
-   `callback`: Function to execute when key is pressed
-   `options`: [`KeyComboOptions`](#keycombooptions) (optional)

**Returns**: Cleanup function (`() => void`)

**Example 1 - Basic Usage** (Recommended):

```tsx
const keyboard = useKeyboardState();

// Watch continuously during component lifecycle
keyboard.watchKey("escape", () => {
    console.log("ESC pressed!");
});
```

**Example 2 - Conditional Watching** (Requires cleanup):

```tsx
useEffect(() => {
    if (isModalOpen) {
        // Watch only when modal is open
        const cleanup = keyboard.watchKey("escape", closeModal);
        return cleanup; // Cleanup when modal closes
    }
}, [isModalOpen, keyboard]);
```

##### isKeyPressed

Check if a specific key is currently pressed.

```tsx
const isPressed = keyboard.isKeyPressed(key);
```

**Parameters**:

-   `key`: Key or array of keys to check

**Returns**: `boolean`

**Examples**:

```tsx
// Check single key
const isEscPressed = keyboard.isKeyPressed(Keys.Escape);

// Check if any arrow key is pressed
const isArrowPressed = keyboard.isKeyPressed([
    Keys.ArrowUp,
    Keys.ArrowDown,
    Keys.ArrowLeft,
    Keys.ArrowRight,
]);
```

---

### KeyComboOptions

Options to control shortcut behavior.

```tsx
interface KeyComboOptions {
    preventDefault?: boolean;
    enabled?: boolean;
    classes?: string[];
    holdDuration?: number;
    onHold?: () => void;
    onRelease?: () => void;
}
```

#### Properties

| Property         | Type         | Default     | Description                                  |
| ---------------- | ------------ | ----------- | -------------------------------------------- |
| `preventDefault` | `boolean`    | `true`      | Prevent browser default behavior             |
| `enabled`        | `boolean`    | `true`      | Enable/disable shortcut (dynamic control)    |
| `classes`        | `string[]`   | `undefined` | Only work inside elements with these classes |
| `holdDuration`   | `number`     | `undefined` | Duration to hold key (milliseconds)          |
| `onHold`         | `() => void` | `undefined` | Execute when held for holdDuration           |
| `onRelease`      | `() => void` | `undefined` | Execute when key is released                 |

#### Examples

**Prevent Default Behavior**:

```tsx
useKeyboardState("ctrl+s", saveFn, {
    preventDefault: true, // Prevent browser save dialog
});
```

**Conditional Activation**:

```tsx
const [editorMode, setEditorMode] = useState(false);

useKeyboardState("ctrl+s", saveFn, {
    enabled: editorMode, // Only active in editor mode
});
```

**Scope Restriction**:

```tsx
useKeyboardState("escape", closeFn, {
    classes: ["modal", "dialog"], // Only inside .modal or .dialog
});
```

**Hold Detection**:

```tsx
useKeyboardState("space", () => {}, {
    holdDuration: 1000,
    onHold: () => console.log("Held for 1 second!"),
    onRelease: () => console.log("Released!"),
});
```

---

### Keys

Enum for type-safe key names with autocompletion.

```tsx
enum Keys {
    // Modifier keys
    Control = "control",
    Shift = "shift",
    Alt = "alt",
    Meta = "meta",

    // Function keys
    Escape = "escape",
    Enter = "enter",
    Space = "space",
    Tab = "tab",
    Backspace = "backspace",
    Delete = "delete",

    // F keys
    F1 = "f1",
    F2 = "f2",
    // ... up to F12

    // Arrow keys
    ArrowUp = "arrowup",
    ArrowDown = "arrowdown",
    ArrowLeft = "arrowleft",
    ArrowRight = "arrowright",

    // Navigation keys
    Home = "home",
    End = "end",
    PageUp = "pageup",
    PageDown = "pagedown",

    // Editing keys
    Insert = "insert",
    CapsLock = "capslock",
    NumLock = "numlock",
    ScrollLock = "scrolllock",

    // Special characters
    Semicolon = ";",
    Equal = "=",
    Comma = ",",
    Minus = "-",
    Period = ".",
    Slash = "/",
    Backquote = "`",
    BracketLeft = "[",
    Backslash = "\\",
    BracketRight = "]",
    Quote = "'",
}
```

#### Usage

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

---

### RecordedMacro

Type representing recorded macro data.

```tsx
interface RecordedMacro {
    keys: RecordedKeyEvent[];
    duration: number;
}

interface RecordedKeyEvent {
    key: string;
    timestamp: number;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}
```

#### Properties

| Property   | Type                 | Description                             |
| ---------- | -------------------- | --------------------------------------- |
| `keys`     | `RecordedKeyEvent[]` | Array of recorded key events            |
| `duration` | `number`             | Total recording duration (milliseconds) |

#### RecordedKeyEvent Properties

| Property    | Type      | Description                            |
| ----------- | --------- | -------------------------------------- |
| `key`       | `string`  | Pressed key name                       |
| `timestamp` | `number`  | Time when key was pressed (from start) |
| `ctrl`      | `boolean` | Ctrl key pressed state (optional)      |
| `shift`     | `boolean` | Shift key pressed state (optional)     |
| `alt`       | `boolean` | Alt key pressed state (optional)       |
| `meta`      | `boolean` | Meta key pressed state (optional)      |

#### Examples

```tsx
// Basic macro structure
const macro: RecordedMacro = {
    keys: [
        { key: "h", timestamp: 0 },
        { key: "e", timestamp: 150 },
        { key: "l", timestamp: 300 },
        { key: "l", timestamp: 450 },
        { key: "o", timestamp: 600 },
    ],
    duration: 600,
};

// Macro with modifiers
const macroWithModifiers: RecordedMacro = {
    keys: [
        { key: "s", timestamp: 0, ctrl: true }, // Ctrl+S
        { key: "z", timestamp: 500, ctrl: true }, // Ctrl+Z
    ],
    duration: 500,
};
```

---

## Utilities

### KeyComboInput

Union type allowing various ways to express key combinations.

```tsx
type KeyComboInput = KeyCombo | string | KeyType[];
```

**Supported Formats**:

1. **String** (Most recommended):

```tsx
"ctrl+s"; // Ctrl + S
"ctrl+shift+p"; // Ctrl + Shift + P
"escape"; // Single ESC key
"g i"; // Key sequence (g then i)
```

2. **Array**:

```tsx
["ctrl", "s"][("ctrl", "shift", "p")]; // Ctrl + S // Ctrl + Shift + P
```

3. **Object**:

```tsx
{ ctrl: true, key: "s" }                    // Ctrl + S
{ ctrl: true, shift: true, key: "p" }       // Ctrl + Shift + P
```

### KeyType

Type representing a key. Can use [`Keys`](#keys) enum or plain strings.

```tsx
type KeyType = Keys | (string & {});
```

Plain strings work fine, but using the `Keys` enum provides autocompletion.

```tsx
// Both work
keyboard.isKeyPressed("escape");
keyboard.isKeyPressed(Keys.Escape); // Autocompletion support
```

---

## Related Documentation

-   [Getting Started](./getting-started.md)
-   [Examples](./examples.md)
