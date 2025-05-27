import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import NoteDetail from "./pages/NoteDetail";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { mode } = useAuth();
  const logoutExpiry = localStorage.getItem("expiresAt");
  const timeTillLogout = logoutExpiry ? parseInt(logoutExpiry, 10) - Date.now() : null;

  return (
    <Router>
      <div className="flex">
        {(mode === "user" || mode === "demo") && <Sidebar />}
        <div className="flex-1 min-h-screen">
          <header className="p-4 border-b border-gray-200 flex justify-end">
            <ProtectedRoute>
              <span className="text-sm">Logged in as: <b>{mode}</b></span>
              <span className="ml-4 text-sm">
                {timeTillLogout !== null ? `Session expires in ${Math.ceil(timeTillLogout / 60000)} minutes` : "Session active"}
              </span>
            </ProtectedRoute>
          </header>
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              <Route path="/courses/:id" element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              <Route path="/notes/:id" element={
                <ProtectedRoute>
                  <NoteDetail />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App
