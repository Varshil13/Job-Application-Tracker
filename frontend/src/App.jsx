import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./AuthPage";
import DocPage from "./pages/Docpage";

function App() {
  const { authUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={authUser ? <DocPage /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <AuthPage />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
