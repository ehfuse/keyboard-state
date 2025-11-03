import { useState } from "react";
import { useKeyboardState, Keys } from "@ehfuse/keyboard-state";
import type { KeyboardState } from "@ehfuse/keyboard-state";

export default function HoldReleaseExample() {
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLog((prev) => [
            `[${new Date().toLocaleTimeString()}] ${message}`,
            ...prev.slice(0, 19),
        ]);
    };

    // 1. Space 키 - 1초 홀드
    useKeyboardState(
        Keys.Space,
        () => {
            // 일반 눌림은 실행 안됨 (holdDuration이 설정되어 있으면)
        },
        {
            holdDuration: 1000,
            onHold: () => {
                addLog("🔥 Space 키 1초 홀드 완료!");
            },
            onRelease: () => {
                addLog("↑ Space 키 릴리즈");
            },
        }
    );

    // 2. Enter 키 - 2초 홀드
    useKeyboardState(Keys.Enter, () => {}, {
        holdDuration: 2000,
        onHold: () => {
            addLog("🔥 Enter 키 2초 홀드 완료! (장문 제출)");
        },
        onRelease: () => {
            addLog("↑ Enter 키 릴리즈");
        },
    });

    // 3. Ctrl+S - 릴리즈 이벤트만
    useKeyboardState(
        "ctrl+s",
        () => {
            addLog("💾 Ctrl+S 눌림 (저장 시작)");
        },
        {
            onRelease: () => {
                addLog("💾 Ctrl+S 릴리즈 (저장 완료)");
            },
        }
    );

    // 4. Shift - 홀드와 릴리즈 모두
    useKeyboardState(Keys.Shift, () => {}, {
        holdDuration: 1500,
        onHold: () => {
            addLog("🔥 Shift 키 1.5초 홀드 (대문자 모드 활성화)");
        },
        onRelease: () => {
            addLog("↑ Shift 키 릴리즈 (대문자 모드 해제)");
        },
    });

    // 5. A 키 - 0.5초 홀드 (짧은 홀드)
    useKeyboardState("a", () => {}, {
        holdDuration: 500,
        onHold: () => {
            addLog("🔥 A 키 0.5초 홀드 (빠른 반복)");
        },
        onRelease: () => {
            addLog("↑ A 키 릴리즈");
        },
    });

    // 시각적 피드백을 위한 키 감지
    const { pressedKeys } = useKeyboardState() as KeyboardState;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">
                Key Hold & Release Example
            </h1>
            <p className="text-gray-600 mb-6">
                키를 길게 누르거나(Hold) 뗄 때(Release) 이벤트를 감지합니다.
            </p>

            {/* Hold Examples Table */}
            <div className="space-y-6 mb-8">
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                        <h2 className="text-xl font-semibold">
                            ⏱️ 키 홀드 감지 (Hold Detection)
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            키를 지정된 시간만큼 길게 누르면 onHold 콜백이
                            실행됩니다
                        </p>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="px-4 py-2 font-semibold">키</th>
                                <th className="px-4 py-2 font-semibold">
                                    홀드 시간
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    동작
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    상태
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr
                                className={
                                    pressedKeys.has("space")
                                        ? "bg-yellow-50"
                                        : ""
                                }
                            >
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        Space
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    1.0초
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    홀드 완료 메시지
                                </td>
                                <td className="px-4 py-3">
                                    {pressedKeys.has("space") ? (
                                        <span className="text-green-600 font-semibold animate-pulse">
                                            ⏳ 누르는 중...
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            대기 중
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr
                                className={
                                    pressedKeys.has("enter")
                                        ? "bg-yellow-50"
                                        : ""
                                }
                            >
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        Enter
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    2.0초
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    장문 제출
                                </td>
                                <td className="px-4 py-3">
                                    {pressedKeys.has("enter") ? (
                                        <span className="text-green-600 font-semibold animate-pulse">
                                            ⏳ 누르는 중...
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            대기 중
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr
                                className={
                                    pressedKeys.has("shift")
                                        ? "bg-yellow-50"
                                        : ""
                                }
                            >
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        Shift
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    1.5초
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    대문자 모드 활성화
                                </td>
                                <td className="px-4 py-3">
                                    {pressedKeys.has("shift") ? (
                                        <span className="text-green-600 font-semibold animate-pulse">
                                            ⏳ 누르는 중...
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            대기 중
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr
                                className={
                                    pressedKeys.has("a") ? "bg-yellow-50" : ""
                                }
                            >
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        A
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    0.5초
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    빠른 반복
                                </td>
                                <td className="px-4 py-3">
                                    {pressedKeys.has("a") ? (
                                        <span className="text-green-600 font-semibold animate-pulse">
                                            ⏳ 누르는 중...
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">
                                            대기 중
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Release Examples Table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                        <h2 className="text-xl font-semibold">
                            ↑ 키 릴리즈 감지 (Release Detection)
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            키를 뗄 때 onRelease 콜백이 실행됩니다
                        </p>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="px-4 py-2 font-semibold">
                                    키 조합
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    눌림 동작
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    릴리즈 동작
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            Ctrl
                                        </kbd>
                                        <span>+</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            S
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    저장 시작
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    저장 완료 메시지
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        Space
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">-</td>
                                <td className="px-4 py-3 text-gray-700">
                                    릴리즈 메시지
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <kbd className="px-3 py-2 bg-gray-100 border rounded font-mono">
                                        Enter
                                    </kbd>
                                </td>
                                <td className="px-4 py-3 text-gray-700">-</td>
                                <td className="px-4 py-3 text-gray-700">
                                    릴리즈 메시지
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Activity Log */}
            <div className="border rounded-lg p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">📋 활동 로그</h2>
                <div className="bg-white p-4 rounded border h-64 overflow-y-auto font-mono text-sm">
                    {log.length === 0 ? (
                        <p className="text-gray-400">위 키들을 눌러보세요...</p>
                    ) : (
                        log.map((entry, index) => (
                            <div key={index} className="mb-1">
                                {entry}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-2">💡 사용법</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                    <li>
                        • <strong>키 홀드</strong>: 키를 지정된 시간만큼 길게
                        누르면 onHold 콜백이 실행됩니다
                    </li>
                    <li>
                        • <strong>키 릴리즈</strong>: 키를 뗄 때 onRelease
                        콜백이 실행됩니다
                    </li>
                    <li>
                        • holdDuration이 설정되면 일반 콜백은 실행되지 않고
                        onHold만 실행됩니다
                    </li>
                    <li>
                        • 홀드 시간이 지나기 전에 키를 떼면 onHold는 실행되지
                        않습니다
                    </li>
                    <li>
                        • Space, Enter, Shift, A 키를 길게 눌러보세요 (각각 다른
                        홀드 시간)
                    </li>
                </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold mb-2">⚠️ 단축키 충돌 감지</h3>
                <p className="text-sm text-gray-700">
                    같은 단축키를 중복 등록하면 콘솔에 경고 메시지가 표시됩니다.
                    브라우저 개발자 도구의 콘솔을 확인해보세요.
                </p>
            </div>
        </div>
    );
}
