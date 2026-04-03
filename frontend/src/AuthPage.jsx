import { useState } from "react";
import AuthLayout from "./components/AuthLayout";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

export default function AuthPage({ onGoogleAuth = () => {} }) {
  const [activeTab, setActiveTab] = useState("signin");

  const title =
    activeTab === "signup" ? "Create your account" : "Sign in to continue";
  const subtitle =
    "Clean, distraction-free auth with Google single sign-on and a simple email flow.";

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
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
