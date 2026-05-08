import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth";
import { useEffect, useState } from "react";
import { useI18n } from "../i18n";

export default function Layout() {
  const { user, isAuthed, logout } = useAuth();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.get("q") || "");
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("wte_theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    setKeyword(params.get("q") || "");
  }, [location.search, params]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("wte_theme", theme);
  }, [theme]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) {
      navigate("/");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-xl font-extrabold text-rose-500">WTE</Link>
          <form onSubmit={onSearch}>
            <input
              className="w-80 max-w-full rounded-full border border-pink-200 bg-white px-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-pink-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder={t("searchPlaceholder")}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
          <button
            className="rounded-full border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            type="button"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          >
            {lang === "zh" ? "EN" : "中文"}
          </button>
          <button
            className="rounded-full border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            type="button"
          >
            {theme === "dark" ? t("lightMode") : t("darkMode")}
          </button>
          {isAuthed ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-700 dark:text-slate-100">{user.username}</span>
              <button className="rounded-full border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600" onClick={() => { logout(); navigate('/'); }}>{t("logout")}</button>
            </div>
          ) : (
            <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600" onClick={() => navigate('/login', { state: { from: location.pathname } })}>{t("login")}</button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
