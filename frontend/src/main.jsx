import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";
import Ref from "./ref";
import JobDetailPage from "./pages/JobDetailPage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContextProvider>
        {/* <App /> */}
        {/* <Ref/> */}
        <JobDetailPage />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
);
