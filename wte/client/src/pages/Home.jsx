import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth";

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loadTopics = async () => {
    const q = new URLSearchParams(location.search).get("q");
    const [topicRes, hotRes] = await Promise.all([
      api.get("/topics", { params: { q: q || undefined } }),
      api.get("/posts/hot"),
    ]);
    setTopics(topicRes.data.items);
    setHotPosts(hotRes.data.items);
  };

  useEffect(() => {
    loadTopics().finally(() => setLoading(false));
  }, [location.search]);

  const createTopic = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/topics", { name, description });
      setShowDialog(false);
      setName("");
      setDescription("");
      navigate(`/topics/${res.data.item.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "创建失败");
    }
  };

  const askLogin = () => {
    alert("请先登录");
    navigate("/login", { state: { from: "/" } });
  };

  return (
    <section className="space-y-4">
      <div className="grid gap-6 md:grid-cols-[1fr_240px]">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">最热</h1>
          {loading ? <p>加载中...</p> : (
            <div className="space-y-3">
              {hotPosts.map((post) => (
                <button
                  key={post.id}
                  className="w-full rounded-lg border border-slate-300 bg-white p-4 text-left hover:border-slate-500 dark:border-slate-600 dark:bg-slate-800"
                  onClick={() => navigate(`/topics/${post.topicId}/posts/${post.id}`)}
                >
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{post.title}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="rounded border border-slate-300 px-2 py-0.5 dark:border-slate-600">#{post.topicName}</span>
                    <span className="mx-2">•</span>
                    {post.authorName}
                    <span className="mx-2">•</span>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-right text-sm text-slate-500 dark:text-slate-400">{post.commentCount} 条评论</p>
                </button>
              ))}
              {hotPosts.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">暂无热门帖子</p>}
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">话题广场</h2>
          <button
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            onClick={() => (isAuthed ? setShowDialog(true) : askLogin())}
          >
            创建话题
          </button>
          <div className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-800">
            <ul className="space-y-1 text-sm">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <button
                    className="w-full text-left text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                    onClick={() => navigate(`/topics/${topic.id}`)}
                  >
                    - {topic.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      {new URLSearchParams(location.search).get("q") && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          当前筛选关键词：{new URLSearchParams(location.search).get("q")}
        </p>
      )}
      {!loading && topics.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">没有找到匹配的话题</p>}

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4">
          <form className="w-full max-w-md space-y-3 rounded-lg bg-white p-4 dark:bg-slate-800" onSubmit={createTopic}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">创建话题</h2>
            <input className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" placeholder="话题名称" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" placeholder="描述" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-slate-700 dark:border-slate-600 dark:text-slate-100" onClick={() => setShowDialog(false)}>取消</button>
              <button className="rounded-md bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900">创建</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
