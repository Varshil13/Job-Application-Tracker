import { useState } from "react";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YahooIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#6001D2">
    <path d="M0 0l6.6 16.5L0 24h3.9l3.3-5.1 3.3 5.1H14L7.4 16.5 14 0h-3.9L6.6 9.6 3.3 0H0zm14 0l3.9 9.6L21.8 0H24l-7.5 16.5V24h-3.3V16.5L6.5 0H14z" />
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const BackgroundDecoration = () => (
  <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none overflow-hidden rounded-br-2xl">
    <div
      className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-400 rounded-tl-full opacity-90"
      style={{ width: 70, height: 70 }}
    />
    <div
      className="absolute bottom-2 right-8 w-14 h-14 bg-sky-400 rounded-full opacity-80"
      style={{ width: 45, height: 45, bottom: 8, right: 30 }}
    />
    <div
      className="absolute bottom-2 right-2 w-12 h-12 bg-green-700 rounded-full opacity-90"
      style={{ width: 40, height: 40, bottom: 5, right: 5 }}
    />
  </div>
);

const AuthButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-5 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 text-sm font-semibold text-gray-700 shadow-sm"
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 text-center">{label}</span>
  </button>
);

const InputField = ({
  label,
  type,
  placeholder,
  hint,
  value,
  onChange,
  rightElement,
}) => (
  <div className="relative">
    <div className="relative border border-gray-300 rounded-lg bg-white focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 transition-all">
      <label className="absolute top-1 left-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pt-5 pb-2 px-3 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
          {rightElement}
        </div>
      )}
    </div>
    {hint && <p className="text-xs text-gray-400 mt-1 ml-1">{hint}</p>}
  </div>
);

// ── Screens ──────────────────────────────────────────────────────────────────

function SignInScreen({ onRegister }) {
  return (
    <div className="flex flex-col gap-3 px-8 py-6">
      <AuthButton icon={<GoogleIcon />} label="Sign in with Google" />
      <AuthButton icon={<EmailIcon />} label="Sign in with Email" />
      <AuthButton icon={<FacebookIcon />} label="Sign in with Facebook" />
      <AuthButton icon={<YahooIcon />} label="Sign in with Yahoo" />
      <p className="text-center text-sm text-gray-500 mt-2">
        Don't have an account?{" "}
        <button
          onClick={onRegister}
          className="text-sky-500 hover:underline font-medium"
        >
          Create one
        </button>
      </p>
    </div>
  );
}

function RegisterScreen({ onSignIn, onEmailRegister }) {
  return (
    <div className="flex flex-col gap-3 px-8 py-6">
      <AuthButton icon={<GoogleIcon />} label="Register with Google" />
      <AuthButton
        icon={<EmailIcon />}
        label="Register with Email"
        onClick={onEmailRegister}
      />
      <p className="text-center text-sm text-gray-500 mt-2">
        Have an account?{" "}
        <button
          onClick={onSignIn}
          className="text-sky-500 hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
      <div className="mt-4 text-center text-xs text-gray-400 leading-relaxed px-2">
        When you link your Google account, Kaggle collects certain information
        stored in that account that you have configured to make available. By
        linking your accounts, you authorize Kaggle to access and use your
        account on the third party service in connection with your use of
        kaggle.com.
      </div>
    </div>
  );
}

function RegisterEmailScreen({ onBack }) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      <InputField
        label="Email"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type={showPass ? "text" : "password"}
        placeholder="Enter password"
        hint="Minimum of 7 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        rightElement={
          <span onClick={() => setShowPass((p) => !p)}>
            <EyeIcon show={showPass} />
          </span>
        }
      />
      <InputField
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        hint="Will be displayed on your profile"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      {/* reCAPTCHA placeholder */}
      <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 bg-gray-50">
        <input type="checkbox" className="w-4 h-4 accent-sky-500" />
        <span className="text-sm text-gray-600 flex-1">I'm not a robot</span>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 leading-tight">
            reCAPTCHA
            <br />
            Privacy · Terms
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-sky-500 flex-shrink-0"
        />
        <div>
          <p className="text-sm text-gray-700 font-medium">
            Email me Kaggle news and tips
          </p>
          <p className="text-xs text-gray-400">You can opt out at any time</p>
        </div>
      </label>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button className="bg-gray-900 text-white text-sm font-semibold px-7 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Signin() {
  // "signin" | "register" | "register-email"
  const [screen, setScreen] = useState("signin");

  const isEmailScreen = screen === "register-email";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Logo */}
        <div className="pt-8 pb-4 flex justify-center">
          <span
            className="text-3xl font-bold text-sky-400 tracking-tight"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            kaggle
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-4">
          {isEmailScreen ? "Register with email" : "Welcome!"}
        </h1>

        {/* Tabs — only show on sign-in / register */}
        {!isEmailScreen && (
          <div className="flex border-b border-gray-200 mx-8">
            <button
              onClick={() => setScreen("signin")}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                screen === "signin"
                  ? "border-b-2 border-gray-800 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setScreen("register")}
              className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                screen === "register"
                  ? "border-b-2 border-gray-800 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Screen content */}
        {screen === "signin" && (
          <SignInScreen onRegister={() => setScreen("register")} />
        )}
        {screen === "register" && (
          <RegisterScreen
            onSignIn={() => setScreen("signin")}
            onEmailRegister={() => setScreen("register-email")}
          />
        )}
        {screen === "register-email" && (
          <RegisterEmailScreen onBack={() => setScreen("register")} />
        )}

        {/* Background decoration */}
        <BackgroundDecoration />
      </div>

      {/* Footer link */}
      {!isEmailScreen && (
        <a
          href="#"
          className="mt-4 text-sm text-gray-500 underline hover:text-gray-700"
        >
          Contact Us / Support
        </a>
      )}
    </div>
  );
}
