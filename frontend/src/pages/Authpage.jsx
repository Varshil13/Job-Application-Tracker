import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import "./Authpage.css";

const googleLogo = (
  <svg viewBox="0 0 533.5 544.3" aria-hidden="true" className="google-icon">
    <path
      d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95h147.4c-6.4 34.5-25.8 63.7-55 83.2v69h88.8c52 47.9 80.3-103.6 80.3-197z"
      fill="#4285f4"
    />
    <path
      d="M272 544.3c74.7 0 137.3-24.7 183-67.3l-88.8-69c-24.7 16.6-56.4 26.4-94.2 26.4-72 0-133-48.6-154.8-113.8h-92.7v71.6C70 474.5 163.8 544.3 272 544.3z"
      fill="#34a853"
    />
    <path
      d="M117.2 320.7c-10.8-32.4-10.8-67.7 0-100l-0.3-71.6h-92.7c-40.5 81.7-40.5 161.8 0 243.5z"
      fill="#fbbc05"
    />
    <path
      d="M272 106.1c40.7-.6 79.6 14 109.6 40.7l82-82.1C418.9 21.9 346.9-4 272 0.5 163.8 0.5 70 70.3 26.4 173.4l92.7 71.6C139 154.7 200 106.1 272 106.1z"
      fill="#ea4335"
    />
  </svg>
);

const PillButton = ({
  children,
  onClick,
  variant = "ghost",
  type = "button",
}) => (
  <button type={type} onClick={onClick} className={`pill-btn pill-${variant}`}>
    {children}
  </button>
);

export default function Authpage({
  onGoogleAuth = (token) => console.log(token),
}) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isSignup = mode === "signup";

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
		const res = await fetch("http://localhost:5000/auth/signup",{
			method:"POST",
			headers:{
				"Content-Type" : "application/json",
			},
			body : JSON.stringify(form),
			credentials:"include"
		})
		const result = await res.json();
		console.log(result)
      
    } else {
		
  const res = await fetch("http://localhost:5000/auth/signin",{
			method:"POST",
			headers:{
				"Content-Type" : "application/json",
			},
			body : JSON.stringify(form),
			credentials:"include"
		})
		const result = await res.json();
		console.log(result)

    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-name">APPLICATION TRACKER</span>
        </div>

        <div className="auth-heading">
          <h1>{isSignup ? "Create your account" : "Sign in to continue"}</h1>
          <p>
            Clean, distraction-free auth with Google single sign-on and a simple
            email flow.
          </p>
        </div>

        <div className="tab-switch">
          <button
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="stack">
          <GoogleLogin
            onSuccess={async (res) => {
              const token = res.credential;

              await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
                credentials: "include",
              });
            }}
            onError={() => console.log("Login Failed")}
          />

          <div className="divider">
            <span />
            <em>or</em>
            <span />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="field">
                <span>Full name</span>
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange("email")}
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Minimum 7 characters"
                value={form.password}
                onChange={handleChange("password")}
                minLength={7}
                required
              />
            </label>

            <PillButton variant="solid" type="submit">
              {isSignup ? "Create account" : "Continue"}
            </PillButton>
          </form>

          {!isSignup && (
            <button className="link-btn" type="button">
              Forgot password?
            </button>
          )}

          <div className="muted">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button type="button" onClick={() => setMode("signup")}>
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
