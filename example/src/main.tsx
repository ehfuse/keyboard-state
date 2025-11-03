import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalFormaProvider } from "@ehfuse/forma";

createRoot(document.getElementById("root")!).render(
    <GlobalFormaProvider>
        <App />
    </GlobalFormaProvider>
);
