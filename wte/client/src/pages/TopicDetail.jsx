import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth";
import BackButton from "../components/BackButton";

export default function TopicDetail() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("latest");
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/topics/${topicId}`).then((res) => setTopic(res.data.item));
  }, [topicId]);

  useEffect(() => {
    api.get(`/topics/${topicId}/posts?sort=${sort}`).then((res) => setPosts(res.data.items));
  }, [topicId, sort]);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">#{topic?.name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{topic?.description}</p>
        </div>
        <div className="flex gap-2">
          <select className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">最新</option>
            <option value="hot">热门</option>
          </select>
          <button className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white dark:bg-slate-100 dark:text-slate-900" onClick={() => isAuthed ? navigate(`/topics/${topicId}/posts/new`) : navigate('/login', { state: { from: `/topics/${topicId}` } })}>创建帖子</button>
        </div>
      </div>
      <div className="space-y-2">
        {posts.map((post) => (
          <button key={post.id} className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left dark:border-slate-700 dark:bg-slate-800" onClick={() => navigate(`/topics/${topicId}/posts/${post.id}`)}>
            <p className="font-medium text-slate-900 dark:text-slate-100">{post.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {post.authorName} · 评论 {post.commentCount} · {new Date(post.updatedAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
