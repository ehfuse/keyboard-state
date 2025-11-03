/**
 * Keyboard State Utility Functions
 * 키보드 관련 유틸리티 함수들
 */

import type { KeyCombo, KeyComboInput, KeyType } from "./types";

/**
 * 키 이름을 정규화 (브라우저 간 호환성)
 * @example normalizeKey("Esc") // "escape"
 * @example normalizeKey(" ") // "space"
 */
export function normalizeKey(key: string): string {
    // Space 키는 " " 문자로 오므로 "space"로 변환
    if (key === " ") {
        return "space";
    }

    const normalized = key.toLowerCase();

    // 키 별칭 매핑
    const aliases: Record<string, string> = {
        esc: "escape",
        cmd: "meta",
        command: "meta",
        win: "meta",
        windows: "meta",
        ctrl: "control",
    };

    return aliases[normalized] || normalized;
}

/**
 * 다양한 형식의 키 조합을 KeyCombo 객체로 변환
 * @param input - 문자열('ctrl+s'), 배열(['Ctrl', 'S']), 객체({ ctrl: true, key: 's' })
 * @returns KeyCombo 객체
 *
 * @example
 * parseKeyCombo('ctrl+s') // { ctrl: true, shift: false, alt: false, meta: false, key: 's' }
 * parseKeyCombo(['Ctrl', 'Shift', 'S']) // { ctrl: true, shift: true, alt: false, meta: false, key: 'S' }
 */
export function parseKeyCombo(input: KeyComboInput): KeyCombo {
    // 1. 이미 KeyCombo 객체면 그대로 반환
    if (typeof input === "object" && !Array.isArray(input) && "key" in input) {
        return input;
    }

    // 2. 배열인 경우: ['Ctrl', 'Shift', 'S']
    if (Array.isArray(input)) {
        const modifiers = {
            ctrl: false,
            shift: false,
            alt: false,
            meta: false,
        };
        let key: KeyType = "";

        input.forEach((k) => {
            const normalized = normalizeKey(String(k));
            if (normalized === "control") modifiers.ctrl = true;
            else if (normalized === "shift") modifiers.shift = true;
            else if (normalized === "alt") modifiers.alt = true;
            else if (normalized === "meta") modifiers.meta = true;
            else key = k as KeyType;
        });

        return { ...modifiers, key };
    }

    // 3. 문자열인 경우: 'ctrl+shift+s' 또는 단일 키 'escape'
    const str = String(input);

    if (str.includes("+")) {
        // 조합 키: 'ctrl+s'
        const parts = str.split("+").map((p) => p.trim());
        const modifiers = {
            ctrl: false,
            shift: false,
            alt: false,
            meta: false,
        };
        let key: KeyType = "";

        parts.forEach((part) => {
            const normalized = normalizeKey(part);
            if (normalized === "control") modifiers.ctrl = true;
            else if (normalized === "shift") modifiers.shift = true;
            else if (normalized === "alt") modifiers.alt = true;
            else if (normalized === "meta") modifiers.meta = true;
            else key = part as KeyType;
        });

        return { ...modifiers, key };
    }

    // 4. 단일 키
    return { key: str as KeyType };
}

/**
 * 키 조합을 문자열 키로 변환
 * @param combo - KeyCombo 객체
 * @returns 문자열 키 (예: 'ctrl+shift+s')
 *
 * @example
 * createComboKey({ ctrl: true, shift: false, alt: false, meta: false, key: 's' }) // 'ctrl+s'
 *
 * @note 키가 수정자 키 자체인 경우, 해당 수정자는 제외
 * (예: Shift 키를 누르면 event.shiftKey도 true가 되므로 'shift+shift'가 아닌 'shift'로 변환)
 */
export function createComboKey(combo: KeyCombo): string {
    const normalizedKey = normalizeKey(combo.key);
    const parts: string[] = [];

    // 키가 수정자 키 자체인 경우, 해당 수정자는 제외
    if (combo.ctrl && normalizedKey !== "control") parts.push("ctrl");
    if (combo.shift && normalizedKey !== "shift") parts.push("shift");
    if (combo.alt && normalizedKey !== "alt") parts.push("alt");
    if (combo.meta && normalizedKey !== "meta") parts.push("meta");

    parts.push(normalizedKey);
    return parts.join("+");
}
