import { useState } from "react";
import { useKeyboardState } from "@ehfuse/keyboard-state";

export default function SequenceExample() {
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLog((prev) => [
            `[${new Date().toLocaleTimeString()}] ${message}`,
            ...prev.slice(0, 19),
        ]);
    };

    // Vim 스타일 연속 키 입력
    useKeyboardState("g i", () => addLog("Navigate to Issues (g i)"));
    useKeyboardState("g h", () => addLog("Navigate to Home (g h)"));
    useKeyboardState("g p", () => addLog("Navigate to Pull Requests (g p)"));
    useKeyboardState("g r", () => addLog("Navigate to Repositories (g r)"));

    // Gmail 스타일
    useKeyboardState("g a", () => addLog("Gmail: Go to All Mail (g a)"));
    useKeyboardState("g s", () => addLog("Gmail: Go to Starred (g s)"));
    useKeyboardState("g d", () => addLog("Gmail: Go to Drafts (g d)"));

    // 다중 키 시퀀스
    useKeyboardState("a b c", () => addLog("Triggered: a b c"));
    useKeyboardState("x y", () => addLog("Triggered: x y"));

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">
                Key Sequence Example (Vim Style)
            </h1>
            <p className="text-gray-600 mb-6">
                연속으로 키를 입력하여 단축키를 실행합니다. 1초 안에 입력해야
                합니다.
            </p>
            <div className="space-y-6 mb-8">
                {/* GitHub Style Table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                        <h2 className="text-lg font-semibold">
                            GitHub 스타일 단축키
                        </h2>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="px-4 py-2 font-semibold">
                                    키 조합
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    동작
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            i
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Issues 페이지로 이동
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            h
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Home 페이지로 이동
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            p
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Pull Requests 페이지로 이동
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            r
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Repositories 페이지로 이동
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Gmail Style Table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                        <h2 className="text-lg font-semibold">
                            Gmail 스타일 단축키
                        </h2>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="px-4 py-2 font-semibold">
                                    키 조합
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    동작
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            a
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    All Mail로 이동
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            s
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Starred로 이동
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            g
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            d
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    Drafts로 이동
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Multi-key Sequences Table */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 border-b">
                        <h2 className="text-lg font-semibold">
                            다중 키 시퀀스
                        </h2>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-sm">
                            <tr>
                                <th className="px-4 py-2 font-semibold">
                                    키 조합
                                </th>
                                <th className="px-4 py-2 font-semibold">
                                    동작
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            a
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            b
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            c
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    시퀀스 ABC 실행
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            x
                                        </kbd>
                                        <span className="text-gray-400">→</span>
                                        <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">
                                            y
                                        </kbd>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    시퀀스 XY 실행
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>{" "}
            <div className="border p-4 rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold mb-3">활동 로그</h2>
                <div className="bg-white p-3 rounded border h-64 overflow-y-auto font-mono text-sm">
                    {log.length === 0 ? (
                        <p className="text-gray-400">
                            위 단축키를 눌러보세요...
                        </p>
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
                        • 키를 <strong>순서대로</strong> 1초 안에 입력하세요
                    </li>
                    <li>
                        • 예: "g" 키를 누른 후 "i" 키를 누르면 "g i" 시퀀스가
                        트리거됩니다
                    </li>
                    <li>
                        • 수정자 키(Ctrl, Shift, Alt, Meta)와 함께 사용할 수
                        없습니다
                    </li>
                    <li>• 1초 이상 지나면 시퀀스가 초기화됩니다</li>
                </ul>
            </div>
        </div>
    );
}
