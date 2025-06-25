import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Courses", to: "/courses" },
  { name: "About", to: "/about" },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { logout, mode } = useAuth();
  const navigate = useNavigate();
  const [sessionExpiryMessage, setSessionExpiryMessage] = useState<string>("Session active");

  useEffect(() => {
    const calculateAndSetExpiry = () => {
      const logoutExpiryTimestamp = localStorage.getItem("expiresAt");
      if (logoutExpiryTimestamp) {
        const timeTillLogoutMs = parseInt(logoutExpiryTimestamp, 10) - Date.now();
        if (timeTillLogoutMs > 0) {
          setSessionExpiryMessage(`Session expires in ${Math.ceil(timeTillLogoutMs / 60000)} minutes`);
        } else {
          setSessionExpiryMessage("Session expired");
        }
      } else {
        setSessionExpiryMessage(mode === "demo" ? "Demo session" : "Session active");
      }
    };

    if (mode === "user") {
      calculateAndSetExpiry();
      const intervalId = setInterval(calculateAndSetExpiry, 30000);
      return () => clearInterval(intervalId);
    } else {
      setSessionExpiryMessage(mode === "demo" ? "Demo session" : "");
    }
  }, [mode, logout]);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div>
      {/* Show hamburger menu on small screens */}
      <div className="md:hidden flex items-center p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Open sidebar">
              <Menu size={28} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <SidebarLinks location={location} onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="ml-4 text-xl font-bold">Study Assistant</span>
      </div>
      {/* Persistent sidebar on desktop */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-gray-100 shadow-lg px-6 py-8 fixed">
        <span className="text-2xl font-bold mb-8">Study Assistant</span>
        <div className="flex flex-col flex-1">
          <SidebarLinks location={location} />
        </div>
        { localStorage.getItem("email") && (
          <div className="text-sm text-gray-600">
            Logged in as: {localStorage.getItem("email")}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="mt-2 mb-2 bg-gray-200 hover:bg-gray-300 text-black-600 rounded px-4 py-2 w-full text-sm h-8">
          Logout
        </button>
        {sessionExpiryMessage && (
          <div className="text-xs text-slate-500 text-center mb-4">
            {sessionExpiryMessage}
          </div>
        )}
      </aside>
      {/* This blank div gives room for fixed sidebar */}
      <div className="hidden md:block w-60"></div>
    </div>
  );
}

function SidebarLinks({ location, onClick }: { location: any; onClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-4">
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-2 rounded transition ${
            location.pathname === link.to
              ? "bg-blue-400 text-white"
              : "text-gray-700 hover:bg-blue-200"
          }`}
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
