import "./App.css";
import { useState } from "react";
function App() {
  const [jobData, setJobData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
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
    const endPoint =
      type === "resume"
        ? "http://localhost:5000/resume/parse"
        : "http://localhost:5000/upload";
    const res = await fetch(endPoint, {
      method: "POST",
      body: formData,
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

    const res = await fetch("http://localhost:5000/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobJSON: jobData,
        resumeJSON: resumeData,
      }),
    });

    const data = await res.json();
    console.log("Match Result:", data);
  }
  return (
    <>
      <h3>Application</h3>
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
    </>
  );
}

export default App;
