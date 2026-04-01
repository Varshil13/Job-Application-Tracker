
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function Ref() {
  const [jobData, setJobData] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  async function getErrorFromResponse(res, fallbackMessage) {
    try {
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const payload = await res.json();
        return payload?.message || payload?.error || fallbackMessage;
      }

      const text = await res.text();
      return text || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  async function handleinfopdf(input, type) {
    try {
      const file = input.target.files[0];

      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Please upload in proper format");
        return;
      }

      // formData tumhara container hai jisme bharke tum apni file bhejoge.
      const formData = new FormData();
      formData.append("pdf", file);
      const endPoint = type === "resume" ? "/api/resume/parse" : "/api/upload";

      console.log(endPoint);
      const res = await fetch(endPoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const serverMessage = await getErrorFromResponse(
          res,
          "Failed to upload PDF",
        );
        throw new Error(serverMessage);
      }

      const data = await res.json();
      if (type === "resume") {
        setResumeData(data);
      } else {
        setJobData(data);
      }
    } catch (err) {
      console.error("handleinfopdf error:", err);
      alert("Failed to process PDF. Please try again.");
    }
  }

  async function handleMatch() {
    try {
      if (!jobData || !resumeData) {
        alert("Upload both files first");
        return;
      }

      const res = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobJSON: jobData,
          resumeJSON: resumeData,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const serverMessage = await getErrorFromResponse(
          res,
          "Match request failed",
        );
        throw new Error(serverMessage);
      }

      const data = await res.json();
      console.log("Match Result:", data);
    } catch (err) {
      console.error("handleMatch error:", err);
      alert("Unable to check match right now.");
    }
  }

  async function handledoc(input) {
    try {
      const file = input.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploadfile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const serverMessage = await getErrorFromResponse(
          res,
          "Document upload failed",
        );
        throw new Error(serverMessage);
      }

      console.log("sending file");
      const data = await res.text();
      console.log(data);
    } catch (err) {
      console.error("handledoc error:", err);
      alert("Failed to upload document.");
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const serverMessage = await getErrorFromResponse(res, "Logout failed");
        throw new Error(serverMessage);
      }

      alert("Logged out");

      window.location.href = "/login";
    } catch (err) {
      console.error("handleLogout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur md:p-10">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-200">
              TRACKER WORKSPACE
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Resume Match Console
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
              Upload the application and resume PDFs, run your compatibility check,
              and submit supporting documents in one place.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 md:w-auto"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-slate-800/60 p-5">
            <h3 className="text-lg font-bold text-white">Application PDF</h3>
            <p className="mt-1 text-sm text-slate-300">Upload job or role details.</p>
            <input
              className="mt-4 block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleinfopdf(e, "application")}
            />
            <p className="mt-3 text-xs text-slate-400">
              Status: {jobData ? "uploaded" : "waiting for upload"}
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-800/60 p-5">
            <h3 className="text-lg font-bold text-white">Resume PDF</h3>
            <p className="mt-1 text-sm text-slate-300">Upload candidate profile.</p>
            <input
              className="mt-4 block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-emerald-300"
              type="file"
              accept="application/pdf"
              onChange={(e) => handleinfopdf(e, "resume")}
            />
            <p className="mt-3 text-xs text-slate-400">
              Status: {resumeData ? "uploaded" : "waiting for upload"}
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-white">Additional Document</h3>
            <p className="mt-1 text-sm text-slate-300">
              Upload any supporting image or PDF document.
            </p>
            <input
              className="mt-4 block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-amber-200"
              type="file"
              accept="image/*,application/pdf"
              onChange={handledoc}
            />
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            onClick={handleMatch}
            className="rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-slate-950 transition hover:brightness-110"
          >
            Check Match
          </button>

          <div className="rounded-xl border border-white/10 bg-slate-800/60 p-3">
            <GoogleLogin
              onSuccess={async (res) => {
                try {
                  const token = res.credential;

                  const response = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                    credentials: "include",
                  });

                  if (!response.ok) {
                    const serverMessage = await getErrorFromResponse(
                      response,
                      "Google login failed",
                    );
                    throw new Error(serverMessage);
                  }
                } catch (err) {
                  console.error("Google login error:", err);
                  alert("Google login failed. Please try again.");
                }
              }}
              onError={() => console.log("Login Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ref;