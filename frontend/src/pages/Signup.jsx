import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import PillButton from "../components/PillButton";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Signup({ onSwitchToSignin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuth();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill all fields");
    }
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");
    try {
      const res = await fetch(
        `api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: form.email }),
        },
      );

      const data = await res.json();
      if (data.user) {
        toast.success("OTP sent to your email!", { id: toastId });
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otp) {
      return toast.error("Please enter the OTP");
    }
    setLoading(true);
    const toastId = toast.loading("Verifying and creating account...");
    try {
      const res = await fetch(
        `api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...form, otp }),
        },
      );

      const data = await res.json();
      if (data.user) {
        toast.success("Account created successfully!", { id: toastId });
        localStorage.setItem("chat-user", JSON.stringify(data.user));
        setAuthUser(data.user);
      } else {
        toast.error(data.message || "Verification failed", { id: toastId });
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

          await fetch("/api/auth/google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            credentials: "include",
          });
          await fetchUser();
        }}
        onError={() => {}}
      />

      <div className="flex items-center gap-2">
        <hr className="w-full border-slate-200" />
        <span className="text-slate-500 text-sm">or</span>
        <hr className="w-full border-slate-200" />
      </div>

      {!otpSent ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSendOtp}
          noValidate
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-slate-600">Full name</span>
            <input
              className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40"
              type="text"
              placeholder="Alex Carter"
              value={form.name}
              onChange={handleChange("name")}
              required
              disabled={loading}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-slate-600">Email</span>
            <input
              className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40"
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
              className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40"
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
            {loading ? "Sending..." : "Send OTP"}
          </PillButton>
        </form>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={handleVerifyAndSignup}
          noValidate
        >
          <label className="flex flex-col gap-1.5">
            <span className="font-semibold text-slate-600">Enter OTP</span>
            <input
              className="px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-40"
              type="text"
              placeholder="Check your email for the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <PillButton variant="solid" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Create Account"}
          </PillButton>
        </form>
      )}

      <div className="text-center text-slate-500">
        Already have an account?{" "}
        <button
          className="font-bold text-sky-500"
          type="button"
          onClick={onSwitchToSignin}
          disabled={loading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
