import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./AuthPage";
import Tracker from "./pages/Tracker";
import DocPage from "./pages/Docpage";
import WorkspaceLayout from "./components/WorkspaceLayout";
import JobDetailPage from "./pages/JobDetailPage";
import AddApplication from "./pages/AddApplication";

function WorkspaceShell({ onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <WorkspaceLayout onLogout={onLogout}>
        <Outlet />
      </WorkspaceLayout>
    </div>
  );
}

function App() {
  const { authUser, loading, setAuthUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuthUser(null);
      localStorage.removeItem("chat-user");
      window.location.href = "/auth";
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Routes>
        <Route
          element={
            authUser ? (
              <WorkspaceShell onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        >
          <Route path="/" element={<Navigate to="/applications" replace />} />
          <Route path="/applications" element={<Tracker />} />
          <Route path="/applications/new" element={<AddApplication />} />
          <Route
            path="/applications/getjobdetails/:jobId"
            element={<JobDetailPage />}
          />
          <Route path="/docs" element={<DocPage />} />
        </Route>
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <AuthPage />}
        />
        <Route
          path="*"
          element={
            <Navigate to={authUser ? "/applications" : "/auth"} replace />
          }
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
