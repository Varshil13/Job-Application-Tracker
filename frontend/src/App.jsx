import "./App.css";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [jobData, setJobData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [file, setFile] = useState(null);

  async function handleinfopdf(input, type) {
    const file = input.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload in proper format");
      return;
    }
    //formData tumhara container hai jisme bharke tum apni file bhejoge , aur bhi kuch backend ko bhejna hai to usko bhi formData me append kar dena
    const formData = new FormData();
    formData.append("pdf", file); //pdf key hai aur file value hai
    const endPoint = type === "resume" ? "/api/resume/parse" : "/api/upload";
    const res = await fetch(endPoint, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await res.json();
    if (type === "resume") {
      setResumeData(data);
    } else {
      setJobData(data);
    }
  }

  async function handleMatch() {
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

    const data = await res.json();
    console.log("Match Result:", data);
  }

  async function handledoc(input) {
    const formData = new FormData();

    formData.append("file", input.target.files[0]);

    const res = await fetch("/api/uploadfile", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    console.log("sending file");

    const data = await res.text();

    console.log(data);
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      alert("Logged out");

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h3 class="bg-blue-100">Application</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleinfopdf(e, "application")}
      />
      <h3>Resume</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleinfopdf(e, "resume")}
      />
      <button onClick={handleMatch}>Check Match</button>

      <h3>DOCument</h3>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handledoc}
      />

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

      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default App;