import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import { isAdminAuthenticated, loginAdmin } from "../../utils/adminAuth";

const THEME_KEY = "as_collection_theme";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/local-admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === "light" ? "light" : "dark";
  });

  const isDark = theme === "dark";

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 350));

    const result = loginAdmin(username, password);

    if (result.success) {
      navigate(redirectPath, { replace: true });
      return;
    }

    setError(result.error);
    setIsSubmitting(false);
  };

  return (
    <div
      className={`admin-app min-h-screen transition-colors duration-300 flex flex-col ${
        isDark ? "bg-primary text-white" : "bg-[#f5f3ee] text-slate-900"
      }`}
      data-theme={theme}
    >
      <header className="flex items-center justify-end px-4 sm:px-6 h-16">
        <button
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
            isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-lg ${
            isDark
              ? "bg-[#111111] border-white/10 shadow-black/40"
              : "bg-white border-slate-200 shadow-slate-200/60"
          }`}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center mb-4 shadow-gold">
              <span className="font-poppins font-black text-primary text-lg">AS</span>
            </div>
            <p className={`font-poppins text-xs uppercase tracking-[0.2em] mb-2 ${
              isDark ? "text-gold" : "text-gold-dark"
            }`}>
              AS Collection
            </p>
            <h1 className={`font-poppins font-bold text-2xl sm:text-3xl mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Admin Login
            </h1>
            <p className={`font-inter text-sm max-w-xs ${
              isDark ? "text-white/50" : "text-slate-500"
            }`}>
              Sign in to access your admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-username"
                className={`block font-inter text-sm font-medium mb-2 ${
                  isDark ? "text-white/80" : "text-slate-700"
                }`}
              >
                Username
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isSubmitting}
                required
                className={`input-luxury w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:opacity-60 ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                }`}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className={`block font-inter text-sm font-medium mb-2 ${
                  isDark ? "text-white/80" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  required
                  className={`input-luxury w-full rounded-xl px-4 py-3 pr-12 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:opacity-60 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:opacity-60 ${
                    isDark ? "text-white/40 hover:text-white/70" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-inter"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold text-primary font-poppins font-semibold text-sm px-6 py-3.5 transition-all duration-200 hover:bg-gold-light hover:shadow-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
