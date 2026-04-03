import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";

const cardClass =
  "bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4";

function ScorePie({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const pieStyle = {
    background: `conic-gradient(#0f766e ${safeScore * 3.6}deg, #e2e8f0 0deg)`,
  };

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative w-36 h-36 min-w-[9rem] aspect-square rounded-full flex-shrink-0"
        style={pieStyle}
      >
        <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-black text-teal-700">{safeScore}%</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">
              Match
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddApplication() {
  const navigate = useNavigate();

  const [jobFile, setJobFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [jobDetails, setJobDetails] = useState(null);
  const [resumeDetails, setResumeDetails] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const [loadingJob, setLoadingJob] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const matchScore = useMemo(() => {
    if (!matchResult) return null;
    return matchResult.matchScore ?? matchResult.score ?? 0;
  }, [matchResult]);

  const uploadJobPdf = async () => {
    if (!jobFile) {
      setError("Please select an application PDF first.");
      return;
    }

    setError("");
    setLoadingJob(true);
    try {
      const formData = new FormData();
      formData.append("pdf", jobFile);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to extract job details");

      const data = await res.json();
      setJobDetails(data);
    } catch (err) {
      console.error(err);
      setError("Could not extract job details from PDF.");
    } finally {
      setLoadingJob(false);
    }
  };

  const uploadResumeAndMatch = async () => {
    if (!resumeFile) {
      setError("Please select a resume PDF.");
      return;
    }
    if (!jobDetails) {
      setError("Upload application PDF first.");
      return;
    }

    setError("");
    setLoadingResume(true);
    try {
      const resumeForm = new FormData();
      resumeForm.append("pdf", resumeFile);

      const resumeRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/resume/parse`,
        {
          method: "POST",
          body: resumeForm,
          credentials: "include",
        },
      );
      if (!resumeRes.ok) throw new Error("Failed to parse resume");

      const resumeJSON = await resumeRes.json();
      setResumeDetails(resumeJSON);

      const matchRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/match`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeJSON, jobJSON: jobDetails }),
        },
      );
      if (!matchRes.ok) throw new Error("Failed to compute match score");

      const matchJSON = await matchRes.json();
      setMatchResult(matchJSON.matchResult ?? matchJSON);
    } catch (err) {
      console.error(err);
      setError("Could not process resume/match details.");
    } finally {
      setLoadingResume(false);
    }
  };

  const saveApplication = async (status) => {
    if (!jobDetails || !matchResult) {
      setError("Upload and process both PDFs before saving.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const extractedEligibility =
        jobDetails.eligibilitySnapshot ?? jobDetails.eligibility ?? {};

      const payload = {
        status,
        company:
          jobDetails.company ?? jobDetails.companyName ?? "Unknown Company",
        role: jobDetails.role ?? jobDetails.position ?? "Unknown Role",
        location: jobDetails.location ?? "Not specified",
        salary: jobDetails.salary ?? jobDetails.stipend ?? null,
        stipend: jobDetails.stipend ?? null,
        jobType: jobDetails.jobType ?? null,
        description: jobDetails.description ?? jobDetails.summary ?? null,
        portalLink: jobDetails.portalLink ?? jobDetails.link ?? null,
        applicationLink: jobDetails.applicationLink ?? jobDetails.link ?? null,
        deadline: jobDetails.deadline ?? jobDetails.applicationDeadline ?? null,
        eligibilitySnapshot: {
          skills: extractedEligibility.skills ?? jobDetails.skills ?? [],
          branches: extractedEligibility.branches ?? jobDetails.branches ?? [],
          degree: extractedEligibility.degree ?? jobDetails.degree ?? null,
          experience:
            extractedEligibility.experience ?? jobDetails.experience ?? null,
          cgpa: extractedEligibility.cgpa ?? jobDetails.cgpa ?? null,
          minGPA: extractedEligibility.minGPA ?? jobDetails.minGPA ?? null,
          year: extractedEligibility.year ?? jobDetails.year ?? null,
        },
        matchResult: {
          matchScore: matchResult.matchScore ?? matchResult.score ?? 0,
          score: matchResult.score ?? matchResult.matchScore ?? 0,
          eligible: matchResult.eligible,
          strengths: matchResult.strengths ?? [],
          missingSkills: matchResult.missingSkills ?? [],
          summary: matchResult.summary ?? "",
          suggestions: matchResult.suggestions ?? [],
        },
      };

      const res = await fetch("/api/applications/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save application");
      }

      navigate("/applications");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save application.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-10 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Add Application
            </h1>
            <p className="text-slate-500 mt-1">
              Upload job and resume PDFs to extract details, calculate match
              score, and save.
            </p>
          </div>
          <button
            onClick={() => navigate("/applications")}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={cardClass}>
            <h2 className="text-lg font-semibold text-slate-800 text-center">
              1. Upload Application PDF
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-teal-600 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setJobFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud
                  className="mx-auto text-slate-400 mb-2"
                  size={32}
                />
                <p className="text-sm text-slate-500">
                  {jobFile ? jobFile.name : "Click to browse or drag & drop"}
                </p>
              </div>
            </div>
            <button
              onClick={uploadJobPdf}
              disabled={loadingJob}
              className="w-full px-5 py-2.5 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800 disabled:opacity-60"
            >
              {loadingJob ? "Extracting..." : "Extract Job Details"}
            </button>
            {jobDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Company
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {jobDetails.company || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Role
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {jobDetails.role || jobDetails.position || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Location
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {jobDetails.location || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Stipend/Salary
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {jobDetails.salary || jobDetails.stipend || "-"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="text-lg font-semibold text-slate-800 text-center">
              2. Upload Resume & Match
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-md relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-teal-600 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud
                  className="mx-auto text-slate-400 mb-2"
                  size={32}
                />
                <p className="text-sm text-slate-500">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to browse or drag & drop"}
                </p>
              </div>
            </div>
            <button
              onClick={uploadResumeAndMatch}
              disabled={loadingResume || !jobDetails}
              className="w-full px-5 py-2.5 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800 disabled:opacity-60"
            >
              {loadingResume ? "Processing..." : "Analyze Match"}
            </button>

            {matchResult && (
              <div className="rounded-2xl border border-slate-100 p-4 bg-white flex flex-col items-center">
                <div className="w-40 h-40">
                  <ScorePie score={matchScore} />
                </div>

                {!!matchResult.summary && (
                  <p className="mt-4 text-sm text-slate-700 text-center">
                    {matchResult.summary}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            3. Save Application
          </h2>
          <p className="text-sm text-slate-500">
            Choose whether this is still a draft or already applied.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => saveApplication("saved")}
              disabled={!jobDetails || !matchResult || saving}
              className="px-5 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Draft This"}
            </button>
            <button
              onClick={() => saveApplication("applied")}
              disabled={!jobDetails || !matchResult || saving}
              className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "I Have Applied"}
            </button>
          </div>
          {resumeDetails && (
            <p className="text-xs text-slate-400">
              Resume parsed successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
