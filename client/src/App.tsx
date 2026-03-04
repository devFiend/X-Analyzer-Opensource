import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";

/**
 * 2026 Builder Tip: 
 * We use a simple guard here. In a production SaaS, you'd verify 
 * the session via an API call or a JWT in a cookie.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing/Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* The Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fallback: Send everything else to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;