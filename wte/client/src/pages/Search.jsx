import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import BackButton from "../components/BackButton";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState({ topics: [], posts: [] });
  const [loading, setLoading] = useState(true);

  const keyword = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!keyword) {
      setResult({ topics: [], posts: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get("/search", { params: { q: keyword } })
      .then((res) => setResult(res.data))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">搜索结果</h1>
        <BackButton />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">关键词：{keyword || "（空）"}</p>

      {loading && <p>搜索中...</p>}

      {!loading && (
        <>
          <div className="space-y-2">
            <h2 className="font-semibold">匹配话题 ({result.topics.length})</h2>
            {result.topics.map((topic) => (
              <button
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left dark:border-slate-700 dark:bg-slate-800"
                key={topic.id}
                onClick={() => navigate(`/topics/${topic.id}`)}
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">#{topic.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{topic.description || "暂无描述"}</p>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">匹配帖子 ({result.posts.length})</h2>
            {result.posts.map((post) => (
              <button
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left dark:border-slate-700 dark:bg-slate-800"
                key={post.id}
                onClick={() => navigate(`/topics/${post.topicId}/posts/${post.id}`)}
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">{post.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  #{post.topicName} · {post.authorName}
                </p>
              </button>
            ))}
          </div>

          {result.topics.length === 0 && result.posts.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">没有找到匹配内容</p>
          )}
        </>
      )}
    </section>
  );
}
