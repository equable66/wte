import { createContext, useContext, useMemo, useState } from "react";

const dict = {
  zh: {
    searchPlaceholder: "请输入搜索内容",
    lightMode: "白天模式",
    darkMode: "黑夜模式",
    login: "登录",
    logout: "退出",
    postArticle: "发布",
    preview: "预览",
    writeSomething: "写点什么...",
    comment: "评论",
    reply: "回复",
    cancelReply: "取消回复",
    edit: "编辑",
    delete: "删除",
  },
  en: {
    searchPlaceholder: "Search topics or posts",
    lightMode: "Light",
    darkMode: "Dark",
    login: "Login",
    logout: "Logout",
    postArticle: "Publish",
    preview: "Preview",
    writeSomething: "Write something...",
    comment: "Comments",
    reply: "Reply",
    cancelReply: "Cancel",
    edit: "Edit",
    delete: "Delete",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("wte_lang") || "zh");

  const value = useMemo(
    () => ({
      lang,
      setLang(next) {
        localStorage.setItem("wte_lang", next);
        setLang(next);
      },
      t(key) {
        return dict[lang]?.[key] || dict.zh[key] || key;
      },
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
