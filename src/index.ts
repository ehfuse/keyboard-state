/**
 * @ehfuse/keyboard-state
 *
 * React hook for managing global keyboard state including modifier keys and key combinations
 *
 * @author ehfuse
 * @version 1.0.0
 */

// Main hook exports
export { useKeyboardState, default } from "./useKeyboardState";
export { useKeyboardRecording } from "./useKeyboardRecording";

// Type exports
export type {
    KeyState,
    KeyComboCallback,
    KeyPressCallback,
    KeyCombo,
    KeyboardState,
    KeyboardShortcutItem,
    KeyType,
    KeyComboOrKey,
    RecordedKeyEvent,
    RecordedMacro,
    UseKeyboardRecordingReturn,
} from "./types";

// Enum exports
export { Keys } from "./types";
