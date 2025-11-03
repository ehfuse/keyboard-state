import { useState } from "react";
import { useKeyboardRecording } from "@ehfuse/keyboard-state";
import type { RecordedMacro } from "@ehfuse/keyboard-state";

export default function RecordingExample() {
    const {
        isRecording,
        recordedMacro,
        startRecording,
        stopRecording,
        clearRecording,
        playMacro,
    } = useKeyboardRecording();

    const [savedMacros, setSavedMacros] = useState<
        Array<{ name: string; macro: RecordedMacro }>
    >([]);
    const [macroName, setMacroName] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLog((prev) => [
            `[${new Date().toLocaleTimeString()}] ${message}`,
            ...prev.slice(0, 19),
        ]);
    };

    const handleStartRecording = () => {
        startRecording();
        addLog("🔴 녹화 시작");
    };

    const handleStopRecording = () => {
        const macro = stopRecording();
        if (macro) {
            addLog(
                `⏹️ 녹화 종료 - ${macro.keys.length}개 키, ${(
                    macro.duration / 1000
                ).toFixed(1)}초`
            );
        }
    };

    const handleSaveMacro = () => {
        if (!recordedMacro || !macroName.trim()) return;

        setSavedMacros((prev) => [
            ...prev,
            { name: macroName.trim(), macro: recordedMacro },
        ]);
        addLog(`💾 매크로 저장: ${macroName.trim()}`);
        setMacroName("");
        clearRecording();
    };

    const handlePlayMacro = async (macro: RecordedMacro, name: string) => {
        setIsPlaying(true);
        addLog(`▶️ 매크로 재생: ${name}`);
        await playMacro(macro);
        addLog(`✅ 재생 완료: ${name}`);
        setIsPlaying(false);
    };

    const handleDeleteMacro = (index: number) => {
        const deleted = savedMacros[index];
        setSavedMacros((prev) => prev.filter((_, i) => i !== index));
        addLog(`🗑️ 매크로 삭제: ${deleted.name}`);
    };

    const formatKey = (key: string) => {
        if (key === " ") return "Space";
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">
                Key Recording & Macro Example
            </h1>
            <p className="text-gray-600 mb-6">
                키보드 입력을 녹화하고 매크로로 저장하여 재생할 수 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Recording Section */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        🎙️ 녹화 컨트롤
                    </h2>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <button
                                onClick={handleStartRecording}
                                disabled={isRecording}
                                className={`px-4 py-2 rounded font-medium ${
                                    isRecording
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                            >
                                {isRecording ? "녹화 중..." : "녹화 시작"}
                            </button>
                            <button
                                onClick={handleStopRecording}
                                disabled={!isRecording}
                                className={`px-4 py-2 rounded font-medium ${
                                    !isRecording
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            >
                                녹화 중지
                            </button>
                        </div>

                        {isRecording && (
                            <div className="flex items-center gap-2 text-red-600 animate-pulse">
                                <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                                <span className="font-semibold">
                                    녹화 중...
                                </span>
                            </div>
                        )}

                        {recordedMacro && !isRecording && (
                            <div className="border rounded p-4 bg-gray-50">
                                <h3 className="font-semibold mb-2">
                                    녹화된 매크로
                                </h3>
                                <div className="text-sm space-y-1 mb-3">
                                    <div>
                                        키 개수: {recordedMacro.keys.length}개
                                    </div>
                                    <div>
                                        총 시간:{" "}
                                        {(
                                            recordedMacro.duration / 1000
                                        ).toFixed(2)}
                                        초
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={macroName}
                                        onChange={(e) =>
                                            setMacroName(e.target.value)
                                        }
                                        placeholder="매크로 이름"
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveMacro}
                                            disabled={!macroName.trim()}
                                            className={`flex-1 px-4 py-2 rounded font-medium ${
                                                !macroName.trim()
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-green-500 hover:bg-green-600 text-white"
                                            }`}
                                        >
                                            💾 저장
                                        </button>
                                        <button
                                            onClick={clearRecording}
                                            className="px-4 py-2 rounded font-medium bg-gray-500 hover:bg-gray-600 text-white"
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Saved Macros Section */}
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        💾 저장된 매크로
                    </h2>

                    {savedMacros.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            저장된 매크로가 없습니다
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {savedMacros.map((item, index) => (
                                <div
                                    key={index}
                                    className="border rounded p-3 bg-gray-50"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                handleDeleteMacro(index)
                                            }
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        {item.macro.keys.length}개 키 ·{" "}
                                        {(item.macro.duration / 1000).toFixed(
                                            1
                                        )}
                                        초
                                    </div>
                                    <button
                                        onClick={() =>
                                            handlePlayMacro(
                                                item.macro,
                                                item.name
                                            )
                                        }
                                        disabled={isPlaying}
                                        className={`w-full px-3 py-2 rounded font-medium ${
                                            isPlaying
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                    >
                                        ▶️ 재생
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recorded Keys Display */}
            {recordedMacro && !isRecording && (
                <div className="border rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        📝 녹화된 키 시퀀스
                    </h2>
                    <div className="bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto">
                        <div className="space-y-1 font-mono text-sm">
                            {recordedMacro.keys.map((event, index) => {
                                const modifiers = [];
                                if (event.ctrl) modifiers.push("Ctrl");
                                if (event.shift) modifiers.push("Shift");
                                if (event.alt) modifiers.push("Alt");
                                if (event.meta) modifiers.push("Meta");

                                const keyDisplay =
                                    modifiers.length > 0
                                        ? `${modifiers.join("+")}+${formatKey(
                                              event.key
                                          )}`
                                        : formatKey(event.key);

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-gray-400 w-16">
                                            {event.timestamp}ms
                                        </span>
                                        <kbd className="px-2 py-1 bg-white border rounded">
                                            {keyDisplay}
                                        </kbd>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Log */}
            <div className="border rounded-lg p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">📋 활동 로그</h2>
                <div className="bg-white p-4 rounded border h-64 overflow-y-auto font-mono text-sm">
                    {log.length === 0 ? (
                        <p className="text-gray-400">로그가 비어있습니다...</p>
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
                        • <strong>녹화 시작</strong> 버튼을 눌러 키 입력 녹화를
                        시작하세요
                    </li>
                    <li>
                        • 원하는 키를 순서대로 입력한 후{" "}
                        <strong>녹화 중지</strong>를 누르세요
                    </li>
                    <li>
                        • 매크로 이름을 입력하고 <strong>저장</strong> 버튼으로
                        저장하세요
                    </li>
                    <li>
                        • 저장된 매크로는 <strong>재생</strong> 버튼으로 다시
                        실행할 수 있습니다
                    </li>
                    <li>
                        • 재생 시 타이밍이 녹화된 그대로 재현됩니다 (콘솔 확인)
                    </li>
                </ul>
            </div>
        </div>
    );
}
