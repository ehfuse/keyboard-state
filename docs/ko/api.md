# API 레퍼런스

## 목차

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

키보드 상태 관리 및 단축키 등록을 위한 메인 훅입니다.

#### 사용법 1: 상태 구독

```tsx
const keyboard = useKeyboardState();
```

**반환값**: [`KeyboardState`](#keyboardstate)

#### 사용법 2: 단일 단축키 등록

```tsx
useKeyboardState(combo, callback, options?);
```

**반환값**: `void`

#### 사용법 3: 여러 단축키 등록 (객체)

```tsx
useKeyboardState({
    "ctrl+s": saveFn,
    escape: closeFn,
});
```

**반환값**: `void`

#### 사용법 4: 여러 단축키 등록 (배열)

```tsx
useKeyboardState([
    { key: "ctrl+s", callback: saveFn, options: { preventDefault: true } },
    { key: "escape", callback: closeFn },
]);
```

**반환값**: `void`

#### 매개변수

| 이름       | 타입                                         | 설명                            |
| ---------- | -------------------------------------------- | ------------------------------- |
| `combo`    | [`KeyComboInput`](#keycomboinput) (선택)     | 키 조합 문자열, 배열, 또는 객체 |
| `callback` | `() => void` (선택)                          | 단축키가 눌렸을 때 실행할 함수  |
| `options`  | [`KeyComboOptions`](#keycombooptions) (선택) | 단축키 동작 옵션                |

#### 키 조합 형식

**문자열 형식** (권장):

```tsx
"ctrl+s"; // Ctrl + S
"ctrl+shift+p"; // Ctrl + Shift + P
"escape"; // ESC
"g i"; // g 그 다음 i (시퀀스)
"ctrl+arrowup"; // Ctrl + 위 화살표
```

**배열 형식**:

```tsx
["ctrl", "s"][("ctrl", "shift", "p")]; // Ctrl + S // Ctrl + Shift + P
```

**객체 형식**:

```tsx
{ ctrl: true, key: "s" }           // Ctrl + S
{ ctrl: true, shift: true, key: "p" } // Ctrl + Shift + P
```

#### 예제

**기본 사용**:

```tsx
function App() {
    // 상태만 구독
    const keyboard = useKeyboardState();

    return <div>Shift: {keyboard.shift ? "ON" : "OFF"}</div>;
}
```

**단일 단축키**:

```tsx
function Editor() {
    useKeyboardState("ctrl+s", () => {
        console.log("저장!");
    });

    return <textarea />;
}
```

**여러 단축키 (객체)**:

```tsx
function App() {
    useKeyboardState({
        "ctrl+s": () => console.log("저장"),
        "ctrl+z": () => console.log("되돌리기"),
        escape: () => console.log("취소"),
    });

    return <div>앱 내용</div>;
}
```

**여러 단축키 (배열, 옵션 포함)**:

```tsx
function App() {
    useKeyboardState([
        {
            key: "ctrl+s",
            callback: () => console.log("저장"),
            options: { holdDuration: 1000 },
        },
        {
            key: "ctrl+z",
            callback: () => console.log("되돌리기"),
        },
    ]);

    return <div>앱 내용</div>;
}
```

**키 시퀀스**:

```tsx
function VimEditor() {
    useKeyboardState({
        "g i": () => console.log("이슈로 이동"),
        "g h": () => console.log("홈으로 이동"),
    });

    return <div>Vim 스타일 에디터</div>;
}
```

**Hold & Release**:

```tsx
function HoldExample() {
    useKeyboardState("space", () => {}, {
        holdDuration: 1000,
        onHold: () => console.log("1초 홀드!"),
        onRelease: () => console.log("떼짐!"),
    });

    return <div>Space를 1초간 눌러보세요</div>;
}
```

---

### useKeyboardRecording

키보드 입력을 녹화하고 재생하는 매크로 기능을 제공하는 훅입니다.

#### 사용법

```tsx
import {
    useKeyboardRecording,
    type KeyboardRecording,
} from "@ehfuse/keyboard-state";

const recording: KeyboardRecording = useKeyboardRecording();

// 또는 구조분해
const {
    isRecording,
    recordedMacro,
    startRecording,
    stopRecording,
    clearRecording,
    playMacro,
} = useKeyboardRecording();
```

#### 반환값

| 속성             | 타입                                        | 설명                             |
| ---------------- | ------------------------------------------- | -------------------------------- |
| `isRecording`    | `boolean`                                   | 현재 녹화 중인지 여부            |
| `recordedMacro`  | [`RecordedMacro`](#recordedmacro) \| `null` | 녹화된 매크로 데이터             |
| `startRecording` | `() => void`                                | 녹화 시작                        |
| `stopRecording`  | `() => RecordedMacro \| null`               | 녹화 중지 및 매크로 반환         |
| `clearRecording` | `() => void`                                | 녹화 데이터 삭제                 |
| `playMacro`      | `(macro: RecordedMacro) => Promise<void>`   | 녹화된 매크로 재생 (타이밍 포함) |

#### 예제

**기본 녹화 및 재생**:

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
                녹화 시작
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
                녹화 중지
            </button>
            <button
                onClick={() => recordedMacro && playMacro(recordedMacro)}
                disabled={!recordedMacro || isRecording}
            >
                재생
            </button>

            {isRecording && <p>🔴 녹화 중...</p>}
            {recordedMacro && (
                <p>
                    녹화된 키: {recordedMacro.keys.length}개, 시간:{" "}
                    {recordedMacro.duration}ms
                </p>
            )}
        </div>
    );
}
```

**매크로 저장 및 로드**:

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
            <button onClick={saveMacro}>현재 매크로 저장</button>
            <ul>
                {savedMacros.map((macro, index) => (
                    <li key={index}>
                        <button onClick={() => playMacro(macro)}>
                            매크로 {index + 1} 재생 ({macro.keys.length}개 키)
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

**JSON으로 저장/로드**:

```tsx
function MacroPersistence() {
    const { recordedMacro, playMacro } = useKeyboardRecording();

    const exportMacro = () => {
        if (recordedMacro) {
            const json = JSON.stringify(recordedMacro);
            // localStorage 또는 파일로 저장
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
            <button onClick={exportMacro}>매크로 내보내기</button>
            <button onClick={importMacro}>매크로 가져오기</button>
        </div>
    );
}
```

---

## Types

### KeyboardState

`useKeyboardState()`가 반환하는 타입입니다.

```tsx
interface KeyboardState {
    // 기본 상태
    capsLock: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    pressedKeys: Set<string>;
    lastPressedKey: string | null;

    // 조합 체크 헬퍼
    isCtrlOrMeta: boolean;

    // 메서드
    watchKey: (
        key: KeyComboInput,
        callback: () => void,
        options?: KeyComboOptions
    ) => () => void;
    isKeyPressed: (key: KeyType | KeyType[]) => boolean;
}
```

#### 속성

| 속성             | 타입             | 설명                                                |
| ---------------- | ---------------- | --------------------------------------------------- |
| `capsLock`       | `boolean`        | Caps Lock 상태                                      |
| `shift`          | `boolean`        | Shift 키 눌림 상태                                  |
| `ctrl`           | `boolean`        | Ctrl 키 눌림 상태                                   |
| `alt`            | `boolean`        | Alt 키 눌림 상태                                    |
| `meta`           | `boolean`        | Meta 키 (Cmd/Win) 눌림 상태                         |
| `pressedKeys`    | `Set<string>`    | 현재 눌려있는 모든 키                               |
| `lastPressedKey` | `string \| null` | 마지막으로 눌린 키                                  |
| `isCtrlOrMeta`   | `boolean`        | Ctrl 또는 Meta 중 하나라도 눌렸는지 (크로스 플랫폼) |

#### 메서드

##### watchKey

동적으로 키 조합을 감시합니다.

```tsx
const cleanup = keyboard.watchKey(key, callback, options?);
```

**매개변수**:

-   `key`: 감시할 키 조합
-   `callback`: 키가 눌렸을 때 실행할 함수
-   `options`: [`KeyComboOptions`](#keycombooptions) (선택)

**반환값**: 정리 함수 (`() => void`)

**예제 1 - 기본 사용** (권장):

```tsx
const keyboard = useKeyboardState();

// 컴포넌트 생명주기 동안 계속 감시
keyboard.watchKey("escape", () => {
    console.log("ESC 눌림!");
});
```

**예제 2 - 조건부 감시** (정리 필요):

```tsx
useEffect(() => {
    if (isModalOpen) {
        // 모달이 열릴 때만 감시
        const cleanup = keyboard.watchKey("escape", closeModal);
        return cleanup; // 모달 닫힐 때 정리
    }
}, [isModalOpen, keyboard]);
```

##### isKeyPressed

특정 키가 현재 눌려있는지 확인합니다.

```tsx
const isPressed = keyboard.isKeyPressed(key);
```

**매개변수**:

-   `key`: 확인할 키 또는 키 배열

**반환값**: `boolean`

**예제**:

```tsx
// 단일 키 확인
const isEscPressed = keyboard.isKeyPressed(Keys.Escape);

// 여러 키 중 하나라도 눌렸는지 확인
const isArrowPressed = keyboard.isKeyPressed([
    Keys.ArrowUp,
    Keys.ArrowDown,
    Keys.ArrowLeft,
    Keys.ArrowRight,
]);
```

---

### KeyComboOptions

단축키의 동작을 제어하는 옵션입니다.

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

#### 속성

| 속성             | 타입         | 기본값      | 설명                                  |
| ---------------- | ------------ | ----------- | ------------------------------------- |
| `preventDefault` | `boolean`    | `true`      | 브라우저 기본 동작을 방지할지 여부    |
| `enabled`        | `boolean`    | `true`      | 단축키 활성화 여부 (동적 제어 가능)   |
| `classes`        | `string[]`   | `undefined` | 특정 클래스를 가진 요소 내에서만 동작 |
| `holdDuration`   | `number`     | `undefined` | 키를 길게 누를 시간 (밀리초)          |
| `onHold`         | `() => void` | `undefined` | `holdDuration`만큼 누르면 실행        |
| `onRelease`      | `() => void` | `undefined` | 키를 뗐을 때 실행                     |

#### 예제

**기본 동작 방지**:

```tsx
useKeyboardState("ctrl+s", saveFn, {
    preventDefault: true, // 브라우저 저장 다이얼로그 방지
});
```

**조건부 활성화**:

```tsx
const [editorMode, setEditorMode] = useState(false);

useKeyboardState("ctrl+s", saveFn, {
    enabled: editorMode, // 에디터 모드일 때만 동작
});
```

**특정 영역에서만 동작**:

```tsx
useKeyboardState("escape", closeFn, {
    classes: ["modal", "dialog"], // modal 또는 dialog 클래스 내에서만
});
```

**Hold 감지**:

```tsx
useKeyboardState("space", () => {}, {
    holdDuration: 1000,
    onHold: () => console.log("1초 홀드!"),
    onRelease: () => console.log("떼짐!"),
});
```

---

### Keys

자동완성을 지원하는 키 열거형입니다.

```tsx
enum Keys {
    // 수정자 키
    Control = "control",
    Shift = "shift",
    Alt = "alt",
    Meta = "meta",

    // 기능 키
    Escape = "escape",
    Enter = "enter",
    Space = "space",
    Tab = "tab",
    Backspace = "backspace",
    Delete = "delete",

    // F 키
    F1 = "f1",
    F2 = "f2",
    // ... F12까지

    // 방향키
    ArrowUp = "arrowup",
    ArrowDown = "arrowdown",
    ArrowLeft = "arrowleft",
    ArrowRight = "arrowright",

    // 탐색 키
    Home = "home",
    End = "end",
    PageUp = "pageup",
    PageDown = "pagedown",

    // 편집 키
    Insert = "insert",
    CapsLock = "capslock",
    NumLock = "numlock",
    ScrollLock = "scrolllock",

    // 특수 문자
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

#### 사용법

```tsx
import { useKeyboardState, Keys } from "@ehfuse/keyboard-state";

function App() {
    useKeyboardState(Keys.Escape, () => {
        console.log("ESC 눌림");
    });

    const keyboard = useKeyboardState();
    const isEscPressed = keyboard.isKeyPressed(Keys.Escape);

    return <div>ESC: {isEscPressed ? "눌림" : "안눌림"}</div>;
}
```

---

### RecordedMacro

녹화된 매크로 데이터를 나타내는 타입입니다.

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

#### 속성

| 속성       | 타입                 | 설명                    |
| ---------- | -------------------- | ----------------------- |
| `keys`     | `RecordedKeyEvent[]` | 녹화된 키 이벤트 배열   |
| `duration` | `number`             | 전체 녹화 시간 (밀리초) |

#### RecordedKeyEvent 속성

| 속성        | 타입      | 설명                            |
| ----------- | --------- | ------------------------------- |
| `key`       | `string`  | 눌린 키 이름                    |
| `timestamp` | `number`  | 키가 눌린 시간 (녹화 시작 기준) |
| `ctrl`      | `boolean` | Ctrl 키 눌림 상태 (선택)        |
| `shift`     | `boolean` | Shift 키 눌림 상태 (선택)       |
| `alt`       | `boolean` | Alt 키 눌림 상태 (선택)         |
| `meta`      | `boolean` | Meta 키 눌림 상태 (선택)        |

#### 예제

```tsx
// 매크로 구조 예시
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

// 수정자 키 포함 예시
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

키 조합을 표현하는 다양한 방식을 허용하는 유니온 타입입니다.

```tsx
type KeyComboInput = KeyCombo | string | KeyType[];
```

**사용 가능한 형식**:

1. **문자열** (가장 권장):

```tsx
"ctrl+s"; // Ctrl + S
"ctrl+shift+p"; // Ctrl + Shift + P
"escape"; // ESC 단일 키
"g i"; // 키 시퀀스 (g 다음 i)
```

2. **배열**:

```tsx
["ctrl", "s"][("ctrl", "shift", "p")]; // Ctrl + S // Ctrl + Shift + P
```

3. **객체**:

```tsx
{ ctrl: true, key: "s" }              // Ctrl + S
{ ctrl: true, shift: true, key: "p" } // Ctrl + Shift + P
```

### KeyType

키를 나타내는 타입입니다. [`Keys`](#keys) 열거형 또는 문자열을 사용할 수 있습니다.

```tsx
type KeyType = Keys | (string & {});
```

일반 문자열도 사용 가능하지만, `Keys` 열거형 사용 시 자동완성이 제공됩니다.

```tsx
// 둘 다 가능
keyboard.isKeyPressed("escape");
keyboard.isKeyPressed(Keys.Escape); // 자동완성 지원
```

---

## 관련 문서

-   [시작하기](./getting-started.md)
-   [예제 모음](./examples.md)
