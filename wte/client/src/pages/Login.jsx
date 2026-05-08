import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import BackButton from "../components/BackButton";

export default function Login() {
  const [account, setAccount] = useState("demo");
  const [password, setPassword] = useState("123456");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(account, password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">登录</h1>
        <BackButton />
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">演示账号：demo / 123456</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" placeholder="用户名或邮箱" value={account} onChange={(e) => setAccount(e.target.value)} />
        <input type="password" className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          记住我
        </label>
        <button disabled={loading} className="w-full rounded-md bg-slate-900 py-2 text-white dark:bg-slate-100 dark:text-slate-900">{loading ? "登录中..." : "登录"}</button>
      </form>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        还没有账号？
        <Link to="/register" state={{ from }} className="ml-1 text-blue-600 hover:underline dark:text-blue-400">
          去注册
        </Link>
      </p>
    </div>
  );
}
