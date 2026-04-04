import { useState } from "react";
import AuthLayout from "./components/AuthLayout";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

export default function AuthPage({ onGoogleAuth = () => {} }) {
  const [activeTab, setActiveTab] = useState("signin");

  const title =
    activeTab === "signup" ? "Create your account" : "Sign in to continue";

  return (
    <AuthLayout
      title={title}
      subtitle=""
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "signin" ? (
        <Signin
          onGoogleAuth={onGoogleAuth}
          onSwitchToSignup={() => setActiveTab("signup")}
        />
      ) : (
        <Signup
          onGoogleAuth={onGoogleAuth}
          onSwitchToSignin={() => setActiveTab("signin")}
        />
      )}
    </AuthLayout>
  );
}
