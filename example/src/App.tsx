import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import BasicExample from "./pages/BasicExample";
import ShortcutsExample from "./pages/ShortcutsExample";
import KeyWatchExample from "./pages/KeyWatchExample";
import OptionsExample from "./pages/OptionsExample";
import SequenceExample from "./pages/SequenceExample";
import RecordingExample from "./pages/RecordingExample";
import HoldReleaseExample from "./pages/HoldReleaseExample";
import "./App.css";

function Navigation() {
    const location = useLocation();

    const navItems = [
        { path: "/", label: "기본 예제", component: "BasicExample" },
        {
            path: "/shortcuts",
            label: "단축키 예제",
            component: "ShortcutsExample",
        },
        {
            path: "/key-watch",
            label: "키 감시 예제",
            component: "KeyWatchExample",
        },
        {
            path: "/options",
            label: "옵션 예제",
            component: "OptionsExample",
        },
        {
            path: "/sequence",
            label: "연속 키 예제",
            component: "SequenceExample",
        },
        {
            path: "/recording",
            label: "녹화 예제",
            component: "RecordingExample",
        },
        {
            path: "/hold-release",
            label: "홀드/릴리즈 예제",
            component: "HoldReleaseExample",
        },
    ];

    return (
        <nav className="navigation">
            <div className="nav-header">
                <h1>🎹 Keyboard State Examples</h1>
                <p>React 키보드 상태 관리 훅 데모</p>
            </div>
            <div className="nav-links">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${
                            location.pathname === item.path ? "active" : ""
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

function AppContent() {
    return (
        <div className="app">
            <Navigation />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<BasicExample />} />
                    <Route path="/shortcuts" element={<ShortcutsExample />} />
                    <Route path="/key-watch" element={<KeyWatchExample />} />
                    <Route path="/options" element={<OptionsExample />} />
                    <Route path="/sequence" element={<SequenceExample />} />
                    <Route path="/recording" element={<RecordingExample />} />
                    <Route
                        path="/hold-release"
                        element={<HoldReleaseExample />}
                    />
                </Routes>
            </main>
            <footer className="footer">
                <p>
                    Built with{" "}
                    <a
                        href="https://github.com/ehfuse/keyboard-state"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @ehfuse/keyboard-state
                    </a>
                </p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
