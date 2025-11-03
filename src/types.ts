/**
 * 키보드 키 열거형
 * 정확한 입력을 위한 모든 특수 키들을 명시적으로 정의
 */
export enum Keys {
    // 수정자 키
    Control = "control",
    Shift = "shift",
    Alt = "alt",
    Meta = "meta",

    // 기능 키
    Escape = "escape",
    Esc = "escape", // Escape 별칭
    Enter = "enter",
    Space = "space",
    Tab = "tab",
    Backspace = "backspace",
    Delete = "delete",

    // F1-F12 키
    F1 = "f1",
    F2 = "f2",
    F3 = "f3",
    F4 = "f4",
    F5 = "f5",
    F6 = "f6",
    F7 = "f7",
    F8 = "f8",
    F9 = "f9",
    F10 = "f10",
    F11 = "f11",
    F12 = "f12",

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

/**
 * 키 타입: Keys 열거형 또는 일반 문자열 (자동완성 지원)
 */
export type KeyType = Keys | (string & {});

/**
 * 키보드 내부 상태 인터페이스
 */
export interface KeyState {
    capsLock: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean; // Cmd(Mac) or Win(Windows)
    pressedKeys: Set<string>; // 현재 눌려있는 모든 키
    lastPressedKey: string | null; // 마지막으로 눌린 키
}

/**
 * 키보드 단축키 옵션
 */
export interface KeyComboOptions {
    /**
     * 브라우저 기본 동작 방지 여부
     * @default true
     */
    preventDefault?: boolean;

    /**
     * 단축키 활성화 여부 (동적으로 제어)
     * @default true
     */
    enabled?: boolean;

    /**
     * 특정 클래스를 가진 요소 내에서만 동작
     * @example ['editor', 'modal']
     */
    classes?: string[];

    /**
     * 키를 길게 누를 때까지의 시간 (밀리초)
     * @example 1000 // 1초 동안 누르면 onHold 호출
     */
    holdDuration?: number;

    /**
     * 키를 holdDuration만큼 길게 눌렀을 때 호출되는 콜백
     */
    onHold?: () => void;

    /**
     * 키를 뗐을 때 호출되는 콜백
     */
    onRelease?: () => void;
}

/**
 * 키 조합 콜백 함수 타입
 */
export type KeyComboCallback = () => void;

/**
 * 키 눌림 콜백 함수 타입
 */
export type KeyPressCallback = (key: string) => void;

/**
 * 키 조합 인터페이스 (단일 키 또는 수정자 키 조합)
 */
export interface KeyCombo {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    key: KeyType;
}

/**
 * 단축 타입: 단일 키만 지정할 때 사용
 */
export type KeyComboOrKey = KeyCombo | KeyType;

/**
 * 키 조합을 표현하는 다양한 방식
 * - 문자열: 'ctrl+s', 'ctrl+shift+p'
 * - 배열: ['Ctrl', 'S'], ['Ctrl', 'Shift', 'P']
 * - 객체: { ctrl: true, key: 's' }
 * - 단일 키: 'escape', Keys.Escape
 */
export type KeyComboInput = KeyCombo | string | KeyType[];

/**
 * 여러 키보드 단축키를 객체로 정의
 */
export type KeyboardShortcuts = Record<string, KeyComboCallback>;

/**
 * 배열 형태로 단축키를 등록할 때 사용하는 인터페이스
 */
export interface KeyboardShortcutItem {
    key: KeyComboInput;
    callback: KeyComboCallback;
    options?: KeyComboOptions;
}

/**
 * 녹화된 키 이벤트
 */
export interface RecordedKeyEvent {
    key: string;
    timestamp: number;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}

/**
 * 녹화된 매크로
 */
export interface RecordedMacro {
    keys: RecordedKeyEvent[];
    duration: number; // 전체 녹화 시간 (밀리초)
}

/**
 * useKeyboardRecording 훅의 반환 타입
 */
export interface UseKeyboardRecordingReturn {
    isRecording: boolean;
    recordedMacro: RecordedMacro | null;
    startRecording: () => void;
    stopRecording: () => RecordedMacro | null;
    clearRecording: () => void;
    playMacro: (macro: RecordedMacro) => Promise<void>;
}

/**
 * useKeyboardState 훅의 반환 타입
 */
export interface KeyboardState {
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

    // 키 조합 및 감시 메서드
    watchKey: (
        combo: KeyComboInput,
        callback: KeyComboCallback,
        options?: KeyComboOptions
    ) => () => void;
    isKeyPressed: (key: KeyType | KeyType[]) => boolean;
}
