import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ApiDemoPage from "../pages/ApiDemoPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/api-demo">API Demo</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api-demo" element={<ApiDemoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
