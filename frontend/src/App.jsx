import { Navigate, Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./AuthPage";
import DocPage from "./pages/Docpage";
import Tracker from "./pages/Tracker";

function App() {
  const { authUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Tracker /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <AuthPage />}
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
