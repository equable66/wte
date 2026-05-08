import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api";
import BackButton from "../components/BackButton";
import { useI18n } from "../i18n";

export default function NewPost() {
  const { t } = useI18n();
  const { topicId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/topics/${topicId}/posts`, { title, content });
      navigate(`/topics/${topicId}`);
    } catch (err) {
      alert(err.response?.data?.message || "发布失败");
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">发布帖子</h1>
        <BackButton fallback={`/topics/${topicId}`} />
      </div>
      <input className="w-full rounded border bg-white px-3 py-2" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid min-h-[520px] gap-0 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm md:grid-cols-2 dark:border-slate-700">
        <textarea
          className="min-h-[520px] w-full resize-none border-r bg-white px-3 py-2 font-mono text-sm outline-none dark:border-gray-700 dark:bg-gray-800"
          placeholder="支持 Markdown 文本，左侧编辑，右侧实时预览"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="min-h-[520px] overflow-y-auto px-4 py-3">
          <div className="mb-2 text-sm text-gray-500">{t("preview")}</div>
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className } = props;
                  return (
                    <code className={`rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-700 ${className || ""}`}>
                      {children}
                    </code>
                  );
                },
                pre(props) {
                  return <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs dark:bg-slate-700" {...props} />;
                },
                h1(props) {
                  return <h1 className="text-2xl font-semibold" {...props} />;
                },
                h2(props) {
                  return <h2 className="text-xl font-semibold" {...props} />;
                },
                ul(props) {
                  return <ul className="list-inside list-disc" {...props} />;
                },
                ol(props) {
                  return <ol className="list-inside list-decimal" {...props} />;
                },
                blockquote(props) {
                  return <blockquote className="border-l-4 border-slate-300 pl-3 text-gray-600 dark:border-slate-600 dark:text-gray-300" {...props} />;
                },
              }}
            >
              {content || "## 预览区\n\n开始输入 Markdown 内容..."}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      <button className="rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-5 py-2 text-white shadow-sm">{t("postArticle")}</button>
    </form>
  );
}
