import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api";
import { useAuth } from "../auth";
import BackButton from "../components/BackButton";
import { useI18n } from "../i18n";

function formatTime(createdAt, updatedAt) {
  const c = new Date(createdAt).toLocaleString();
  const u = new Date(updatedAt).toLocaleString();
  if (c === u) return `创建于 ${c}`;
  return `创建于 ${c} · 更新于 ${u}`;
}

export default function PostDetail() {
  const { t } = useI18n();
  const { postId } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { isAuthed, user } = useAuth();
  const navigate = useNavigate();

  const refresh = async () => {
    const [p, c] = await Promise.all([api.get(`/posts/${postId}`), api.get(`/posts/${postId}/comments`)]);
    setData(p.data.item);
    setComments(c.data.items);
  };

  useEffect(() => {
    refresh();
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!isAuthed) {
      alert("请先登录");
      navigate("/login", { state: { from: `/topics/${data.post.topicId}/posts/${postId}` } });
      return;
    }
    if (!content.trim()) return;
    await api.post(`/posts/${postId}/comments`, { content, parentId: replyTo?.id || null });
    setContent("");
    setReplyTo(null);
    refresh();
  };

  const startEditPost = () => {
    setEditing(true);
    setEditTitle(data.post.title);
    setEditContent(data.post.content);
  };

  const submitEditPost = async (e) => {
    e.preventDefault();
    await api.put(`/posts/${postId}`, { title: editTitle, content: editContent });
    setEditing(false);
    refresh();
  };

  const deletePost = async () => {
    if (!confirm("确定删除这个帖子吗？")) return;
    await api.delete(`/posts/${postId}`);
    navigate(`/topics/${data.post.topicId}`);
  };

  const deleteComment = async (commentId) => {
    if (!confirm("确定删除这条评论吗？")) return;
    await api.delete(`/comments/${commentId}`);
    refresh();
  };

  const renderComment = (item, isReply = false) => (
    <div key={item.id} className={`rounded-2xl border border-pink-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${isReply ? "ml-8 mt-2" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{item.authorName}</p>
          <p className="text-xs text-gray-500">{formatTime(item.createdAt, item.updatedAt)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border px-2 py-1 text-xs dark:border-gray-500"
            onClick={() => {
              if (!isAuthed) {
                alert("请先登录");
                navigate("/login", { state: { from: `/topics/${data.post.topicId}/posts/${postId}` } });
                return;
              }
              setReplyTo({ id: item.id, authorName: item.authorName });
            }}
          >
            {t("reply")}
          </button>
          {user?.id === item.authorId && (
            <button type="button" className="rounded-full border px-2 py-1 text-xs text-red-600 dark:border-gray-500" onClick={() => deleteComment(item.id)}>
              {t("delete")}
            </button>
          )}
        </div>
      </div>
      <p className="mt-1 text-sm whitespace-pre-wrap">{item.content}</p>
      {item.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  if (!data) return <p>加载中...</p>;

  const canManagePost = user?.id === data.post.authorId;

  return (
    <section className="space-y-4">
      <BackButton fallback={`/topics/${data.post.topicId}`} />

      <article className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {!editing ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold">{data.post.title}</h1>
              {canManagePost && (
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border px-2 py-1 text-sm dark:border-gray-500" onClick={startEditPost}>{t("edit")}</button>
                  <button type="button" className="rounded-full border px-2 py-1 text-sm text-red-600 dark:border-gray-500" onClick={deletePost}>{t("delete")}</button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">{data.authorName} · {formatTime(data.post.createdAt, data.post.updatedAt)}</p>
            <div className="markdown-body mt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.post.content}</ReactMarkdown>
            </div>
          </>
        ) : (
          <form className="space-y-2" onSubmit={submitEditPost}>
            <input className="w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-700" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <textarea className="min-h-40 w-full rounded-xl border px-3 py-2 dark:border-gray-600 dark:bg-gray-700" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded-full border px-3 py-1 dark:border-gray-500" onClick={() => setEditing(false)}>取消</button>
              <button className="rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-3 py-1 text-white">保存修改</button>
            </div>
          </form>
        )}
      </article>

      <form className="space-y-2 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800" onSubmit={submitComment}>
        <p className="font-medium">{t("comment")}</p>
        {!isAuthed && <p className="text-sm text-gray-500">游客可浏览评论，登录后可评论/回复。</p>}
        {replyTo && (
          <div className="flex items-center justify-between rounded-xl bg-pink-50 px-3 py-2 text-sm dark:bg-gray-700">
            <span>{t("reply")} @{replyTo.authorName}</span>
            <button type="button" className="rounded-full border px-2 py-1 dark:border-gray-500" onClick={() => setReplyTo(null)}>
              {t("cancelReply")}
            </button>
          </div>
        )}
        <textarea
          disabled={!isAuthed}
          className="min-h-24 w-full rounded-xl border border-pink-100 px-3 py-2 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthed ? t("writeSomething") : "请先登录"}
        />
        <div className="flex items-center gap-2">
          <button disabled={!isAuthed} className="rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-4 py-1.5 text-sm text-white disabled:opacity-40">{t("postArticle")}</button>
        </div>
      </form>

      <div className="space-y-2">
        {comments.map((item) => renderComment(item))}
      </div>
    </section>
  );
}
