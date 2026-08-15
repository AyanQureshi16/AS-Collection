import { useEffect, useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin } from "../../utils/adminAuth";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Image,
  BarChart3,
  Settings,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

const THEME_KEY = "as_collection_theme";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/local-admin" },
  { icon: Package, label: "Products", path: "/local-admin/products" },
  { icon: Tag, label: "Categories", path: "/local-admin/categories" },
  { icon: ShoppingBag, label: "Orders", path: "/local-admin/orders" },
  { icon: Users, label: "Customers", path: "/local-admin/customers" },
  { icon: MessageSquare, label: "Reviews", path: "/local-admin/reviews" },
  { icon: Image, label: "Media", path: "/local-admin/media" },
  { icon: BarChart3, label: "Analytics", path: "/local-admin/analytics" },
  { icon: Settings, label: "Settings", path: "/local-admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === "light" ? "light" : "dark";
  });
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  const handleExitAdmin = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div
      className={`admin-app min-h-screen transition-colors duration-300 ${
        isDark ? "bg-primary text-white" : "bg-[#f5f3ee] text-slate-900"
      }`}
      data-theme={theme}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full border-r transition-all duration-300 z-40
          ${isDark ? "bg-[#111111] border-white/10" : "bg-white border-slate-200 shadow-sm"}
          ${sidebarOpen ? "w-64" : "w-20"} hidden lg:block`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-center border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <span className="font-poppins font-black text-primary text-xs">Z</span>
              </div>
              <span className={`font-poppins font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                ZELMIOR Admin
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="font-poppins font-black text-primary text-xs">Z</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : isDark
                      ? "text-white/60 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-inter text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
          >
            <ChevronRight
              size={20}
              className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
            />
            {sidebarOpen && (
              <span className="font-inter text-sm font-medium">Collapse</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full w-72 border-r z-50 lg:hidden ${
              isDark ? "bg-[#111111] border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            {/* Logo */}
            <div className={`h-16 flex items-center justify-between px-6 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                  <span className="font-poppins font-black text-primary text-xs">Z</span>
                </div>
                <span className={`font-poppins font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                  ZELMIOR Admin
                </span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={toggleMobileMenu}
                className={isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-gold/10 text-gold border border-gold/20"
                        : isDark
                          ? "text-white/60 hover:text-white hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="font-inter text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 lg:ml-0
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
      >
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark ? "bg-[#111111]/80 border-white/5" : "bg-white/90 border-slate-200 shadow-sm"
        }`}>
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Open menu"
                onClick={toggleMobileMenu}
                className={`lg:hidden ${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Menu size={24} />
              </button>
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={toggleSidebar}
                className={`hidden lg:block ${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                <Menu size={24} />
              </button>
              <div className="hidden sm:block">
                <h1 className={`font-poppins font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                  {sidebarItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
                </h1>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className={`hidden md:flex items-center rounded-xl px-3 py-2 border ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
              }`}>
                <Search size={16} className={isDark ? "text-white/30" : "text-slate-400"} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`bg-transparent border-none outline-none text-sm ml-2 w-40 ${
                    isDark ? "text-white placeholder:text-white/30" : "text-slate-700 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Notifications */}
              <button
                type="button"
                aria-label="Notifications"
                title="Notifications"
                className={`relative p-2 transition-colors ${
                  isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleTheme}
                className={`p-2 transition-colors ${
                  isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Exit Admin */}
              <button
                type="button"
                aria-label="Exit Admin"
                title="Exit Admin"
                onClick={handleExitAdmin}
                className={`p-2 transition-colors ${
                  isDark ? "text-white/60 hover:text-red-400" : "text-slate-600 hover:text-red-500"
                }`}
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
