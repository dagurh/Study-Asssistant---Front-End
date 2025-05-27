import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { mode } = useAuth();
  const { login, enterDemo } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "user" || mode === "demo") {
      navigate("/dashboard", { replace: true });
    }
  }, [mode, navigate]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!response.ok) {
        setError("Login failed. Check credentials.");
        setLoading(false);
        return;
      }
      
      const data = await response.json();

      if (!data.access_token) {
        setError("No token received.");
        setLoading(false);
        return;
      }
      login(data.access_token);
      setOpen(false);
      setEmail("");
      setPassword("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Network error.");
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    enterDemo();
    setOpen(false);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Study Assistant</h1>
      <div className="flex gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Log In</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log in</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={handleDemoLogin}>Demo</Button>
      </div>
    </div>
  );
}
