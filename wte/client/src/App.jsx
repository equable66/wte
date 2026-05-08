import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TopicDetail from "./pages/TopicDetail";
import NewPost from "./pages/NewPost";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Register from "./pages/Register";
import { useAuth } from "./auth";

function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="p-4">加载中...</p>;
  if (!isAuthed) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="topics/:topicId" element={<TopicDetail />} />
          <Route path="topics/:topicId/posts/new" element={<RequireAuth><NewPost /></RequireAuth>} />
          <Route path="topics/:topicId/posts/:postId" element={<PostDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
