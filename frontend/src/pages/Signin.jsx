import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import PillButton from "../components/PillButton";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signin({ onSwitchToSignup }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuth();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please enter email and password.");
    }
    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const res = await fetch(
        `api/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        },
      );

      const data = await res.json();
      if (data.user) {
        toast.success("Login Successful!", { id: toastId });
        localStorage.setItem("chat-user", JSON.stringify(data.user));
        setAuthUser(data.user);
      } else {
        toast.error(data.message || "Sign in failed", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GoogleLogin
        onSuccess={async (res) => {
          const token = res.credential;

          const response = await fetch("api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            credentials: "include",
          });

          const data = await response.json();

          if (data.user) {
            localStorage.setItem("chat-user", JSON.stringify(data.user));
            setAuthUser(data.user);
          }
        }}
        onError={() => {}}
      />

      <div className="flex items-center gap-2">
        <hr className="w-full border-slate-200" />
        <span className="text-slate-500 text-sm">or</span>
        <hr className="w-full border-slate-200" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-slate-600">Email</span>
          <input
            className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40 disabled:opacity-50"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            required
            disabled={loading}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-semibold text-slate-600">Password</span>
          <input
            className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40 disabled:opacity-50"
            type="password"
            placeholder="Minimum 7 characters"
            value={form.password}
            onChange={handleChange("password")}
            minLength={7}
            required
            disabled={loading}
          />
        </label>

        <PillButton variant="solid" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Continue"}
        </PillButton>
      </form>

      <button
        className="text-sky-500 font-semibold self-start disabled:opacity-50"
        type="button"
        disabled={loading}
      >
        Forgot password?
      </button>

      <div className="text-center text-slate-500">
        New here?{" "}
        <button
          className="font-bold text-sky-500 disabled:opacity-50"
          type="button"
          onClick={onSwitchToSignup}
          disabled={loading}
        >
          Create account
        </button>
      </div>
    </div>
  );
}
