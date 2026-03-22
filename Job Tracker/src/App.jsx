import "./App.css";

function App() {
  async function handleinfopdf(input) {
    const file = input.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload in proper format");
      return;
    }
    //formData tumhara container hai jisme bharke tum apni file bhejoge , aur bhi kuch backend ko bhejna hai to usko bhi formData me append kar dena
    const formData = new FormData();
    formData.append("pdf", file); //pdf key hai aur file value hai
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  }
  return (
    <>
      <input
        type="file"
        id="pdfinput"
        accept="application/pdf"
        onChange={handleinfopdf}
      />
    </>
  );
}

export default App;