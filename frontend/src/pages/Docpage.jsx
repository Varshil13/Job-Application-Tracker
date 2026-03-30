import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Plus,
  X,
  UploadCloud,
  Check,
} from "lucide-react";

const DownloadLoader = ({ fileName }) => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-6">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Notebook body */}
        <rect
          x="30"
          y="20"
          width="90"
          height="110"
          rx="8"
          fill="#e6fffa"
          stroke="#0f766e"
          strokeWidth="2.5"
        />
        {/* Spiral binding dots */}
        {[34, 50, 66, 82, 98, 114].map((y, i) => (
          <circle key={i} cx="30" cy={y} r="4" fill="#0f766e" />
        ))}
        {/* Ruled lines (background) */}
        {[52, 64, 76, 88, 100].map((y, i) => (
          <line
            key={i}
            x1="46"
            y1={y}
            x2="110"
            y2={y}
            stroke="#99f6e4"
            strokeWidth="1.5"
          />
        ))}
        {/* Animated writing lines */}
        <line
          x1="46"
          y1="52"
          x2="46"
          y2="52"
          stroke="#0f766e"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            from="46"
            to="100"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </line>
        <line
          x1="46"
          y1="64"
          x2="46"
          y2="64"
          stroke="#0f766e"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            from="46"
            to="90"
            dur="1.8s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </line>
        <line
          x1="46"
          y1="76"
          x2="46"
          y2="76"
          stroke="#0f766e"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            from="46"
            to="95"
            dur="1.8s"
            begin="0.4s"
            repeatCount="indefinite"
          />
        </line>
        <line
          x1="46"
          y1="88"
          x2="46"
          y2="88"
          stroke="#0f766e"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate
            attributeName="x2"
            from="46"
            to="80"
            dur="1.8s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </line>
        {/* Animated pen */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="54,40; 100,40; 54,52; 90,52; 54,64; 95,64; 54,76; 80,76; 54,88"
            keyTimes="0; 0.1; 0.125; 0.235; 0.26; 0.37; 0.395; 0.5; 0.525"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <rect x="-6" y="-26" width="12" height="22" rx="3" fill="#0f766e" />
          <rect x="2" y="-26" width="2.5" height="20" rx="1" fill="#0d635d" />
          <polygon points="-6,-4 6,-4 0,4" fill="#374151" />
          <polygon points="-1,-4 1,-4 0,2" fill="#6b7280" />
          <circle cx="0" cy="4" r="1.5" fill="#0f766e">
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      <div className="text-center">
        <p className="text-[#0f766e] text-lg font-semibold tracking-wide">
          Decrypting your document...
        </p>
        {fileName && (
          <p className="text-slate-400 text-sm mt-1 max-w-xs truncate">
            {fileName}
          </p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#0f766e] inline-block animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DocPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const fetchDocs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/docs/documents`,
        {
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (docId) => {
    if (!editValue.trim()) {
      return toast.warn("Name can't be empty");
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/docs/rename/${docId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ docName: editValue }),
        },
      );
      if (!response.ok) throw new Error("Rename failed");
      toast.success("Document renamed!");
      setEditingId(null);
      fetchDocs();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/docs/delete/${deleteModal.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Document deleted!");
      setDeleteModal(null);
      setConfirmText("");
      fetchDocs();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDownload = async (docId, fileName) => {
    setDownloadingDoc({ id: docId, name: fileName });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/docs/download/${docId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "document");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Download error : ", error);
      toast.error(
        error.message || "Failed to download document. Please try again.",
      );
    } finally {
      setDownloadingDoc(null);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !docName) return toast.warn("Please fill all fields");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("docName", docName);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/uploadfile`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (response.ok) {
        setIsModalOpen(false);
        setDocName("");
        setSelectedFile(null);
        fetchDocs();
        toast.success("Document uploaded successfully!");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      {/* Toast — top center */}
      <ToastContainer position="top-center" theme="light" />

      {/* Download overlay */}
      {downloadingDoc && <DownloadLoader fileName={downloadingDoc.name} />}

      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#0f766e]">Secure Vault</h1>
          <p className="text-slate-500 mt-2">
            Manage and access your encrypted documents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#0f766e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d635d] transition-all shadow-lg shadow-teal-900/20"
        >
          <Plus size={20} />
          Upload Document
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f766e]"></div>
            <p className="text-slate-500 mt-4">Decrypting your vault...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,160px))] justify-start gap-x-5 gap-y-16">
            {documents.map((doc) => {
              const isPdf = doc.mimeType === "application/pdf";
              const isDoc =
                doc.mimeType?.includes("word") || doc.mimeType?.includes("document");
              const isImg = doc.mimeType?.startsWith("image/");

              const typeLabel = isPdf
                ? "PDF"
                : isDoc
                  ? "DOC"
                  : isImg
                    ? "IMG"
                    : (doc.mimeType?.split("/")[1] || "FILE").toUpperCase().slice(0, 4);

              const pageGradient = isPdf
                ? "linear-gradient(180deg, #fff7f8 0%, #ffe9ec 100%)"
                : isDoc
                  ? "linear-gradient(180deg, #f4f8ff 0%, #e7efff 100%)"
                  : isImg
                    ? "linear-gradient(180deg, #effdf5 0%, #e4f9ed 100%)"
                    : "linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%)";

              const borderColor = isPdf
                ? "#fda4af"
                : isDoc
                  ? "#93c5fd"
                  : isImg
                    ? "#86efac"
                    : "#cbd5e1";

              const badgeGradient = isPdf
                ? "linear-gradient(180deg, #fb7185 0%, #e11d48 100%)"
                : isDoc
                  ? "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)"
                  : isImg
                    ? "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)"
                    : "linear-gradient(180deg, #64748b 0%, #475569 100%)";

              return (
                <div
                  key={doc._id}
                  className="group relative flex h-[300px] w-40 flex-col items-center justify-start cursor-default select-none"
                >
                  <div
                    className="relative mx-auto h-52 w-40 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ filter: "drop-shadow(0 16px 28px rgba(2, 6, 23, 0.18))" }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white">
                      <div
                        className="absolute inset-0 rounded-[22px] border"
                        style={{ background: pageGradient, borderColor }}
                      />

                      <div
                        className="absolute right-0 top-0 h-10 w-10"
                        style={{
                          clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                          background: borderColor,
                          opacity: 0.9,
                        }}
                      />

                      <div className="absolute inset-x-5 top-[54px] flex h-[58px] items-center justify-center">
                        <p
                          className="text-center text-[15px] font-bold leading-snug tracking-[0.01em] text-slate-800"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontFamily: "Sora, Poppins, 'Segoe UI', sans-serif",
                          }}
                          title={doc.docName}
                        >
                          {doc.docName}
                        </p>
                      </div>

                      <div
                        className="absolute bottom-0 left-0 right-0 flex h-16 items-center justify-center rounded-b-[22px] text-xl font-black tracking-[0.16em] text-white"
                        style={{ background: badgeGradient }}
                      >
                        {typeLabel}
                      </div>

                      <div className="absolute inset-x-0 bottom-[74px] flex justify-center">
                        <span
                          className="text-[12px] font-semibold tracking-[0.02em] text-slate-700"
                          style={{
                            fontFamily: "Sora, Poppins, 'Segoe UI', sans-serif",
                            textShadow: "0 1px 1px rgba(255,255,255,0.55)",
                          }}
                        >
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {editingId !== doc._id && (
                    <div className="pointer-events-none absolute left-1/2 top-[214px] z-20 w-40 -translate-x-1/2 translate-y-1 origin-top rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 opacity-0 scale-y-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:scale-y-100 group-focus-within:opacity-100">
                      <button
                        onClick={() => {
                          setEditingId(doc._id);
                          setEditValue(doc.docName);
                        }}
                        className="block w-full border-b border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDownload(doc._id, doc.originalName)}
                        disabled={!!downloadingDoc}
                        className="block w-full border-b border-slate-100 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModal({ id: doc._id, name: doc.docName });
                          setConfirmText("");
                        }}
                        className="block w-full px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {editingId === doc._id ? (
                    <div className="mt-3 flex w-40 items-center gap-1.5">
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(doc._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 rounded-lg border border-[#0f766e]/45 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
                      />
                      <button
                        onClick={() => handleRename(doc._id)}
                        className="text-[#0f766e] hover:text-[#0d635d]"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
            <UploadCloud className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 text-lg">No documents found.</p>
            <p className="text-slate-300 text-sm">
              Upload your first file to see it here.
            </p>
          </div>
        )}
      </main>

      {/* ── Delete modal — outside the map ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-slate-800">
                Delete Document
              </h2>
              <button
                onClick={() => {
                  setDeleteModal(null);
                  setConfirmText("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-slate-500 text-sm mb-1">
              You are about to delete{" "}
              <span className="font-semibold text-slate-700">
                {deleteModal.name}
              </span>
              . This action cannot be undone.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Type <span className="font-bold text-red-500">confirm</span> below
              to proceed.
            </p>

            <input
              autoFocus
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type confirm here"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(null);
                  setConfirmText("");
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== "confirm"}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                New Document
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Resume"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0f766e] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select File
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#0f766e] transition-colors">
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <UploadCloud
                    className="mx-auto text-slate-400 mb-2"
                    size={32}
                  />
                  <p className="text-sm text-slate-500">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to browse or drag & drop"}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#0f766e] text-white py-4 rounded-xl font-bold hover:bg-[#0d635d] disabled:opacity-50 transition-all"
              >
                {uploading ? "Encrypting & Uploading..." : "Secure Upload"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocPage;
