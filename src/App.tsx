import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import About from "./pages/About";
import CourseDetail from "./pages/CourseDetail";
import NoteDetail from "./pages/NoteDetail";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { mode } = useAuth();

  return (
    <Router>
      <div className="flex">
        {(mode === "user" || mode === "demo") && <Sidebar />}
        <div className="flex-1">
          <main className="p-6 m-4 bg-white rounded-lg">
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
              <Route path="/about" element={
                <ProtectedRoute>
                  <About />
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
