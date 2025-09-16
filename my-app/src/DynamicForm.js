import React, { useState } from "react";
import Papa from "papaparse";
import { apiUrl } from "../../api"; // ✅ import your env-aware helper

const DynamicForm = () => {
  const [fields, setFields] = useState([{ field: "", description: "" }]);
  const [size, setSize] = useState("");            // store as string in input
  const [loading, setLoading] = useState(false);
  const [dataset, setDataset] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null); // ✅ null initial
  const [showDownBut, setShowDownBut] = useState(false);

  const handleAddMore = () => {
    setFields((prev) => [...prev, { field: "", description: "" }]);
  };

  const handleInputChange = (index, e) => {
    const copy = [...fields];
    copy[index][e.target.name] = e.target.value;
    setFields(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    const sizeNum = Number(size);
    const nonEmpty = fields.filter(
      (f) => f.field.trim().length > 0 && f.description.trim().length > 0
    );

    if (!Number.isFinite(sizeNum) || sizeNum <= 0) {
      alert("Please enter a valid dataset size (> 0).");
      return;
    }
    if (nonEmpty.length === 0) {
      alert("Please add at least one field with a description.");
      return;
    }

    setLoading(true);
    setShowDownBut(false);
    setDownloadUrl(null);

    const payload = {
      size: sizeNum,
      fields: nonEmpty.map((f) => f.field.trim()),
      descriptions: nonEmpty.map((f) => f.description.trim()),
    };

    try {
      const res = await fetch(apiUrl("/generate-dataset-from-description"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const result = await res.json();
      if (result?.dataset && Array.isArray(result.dataset)) {
        setDataset(result.dataset);

        // Convert JSON -> CSV and prep download
        const csv = Papa.unparse(result.dataset);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setShowDownBut(true);
      } else {
        throw new Error("No dataset returned by the server.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to generate dataset. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "generated_dataset.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="datasetGen">
      <div className="datasetfromdesc">
        <h2 className="datasetfromdeschead">Generate Data</h2>

        <input
          type="number"
          min={1}
          name="size"
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="sizeInputBox"
        />

        <form onSubmit={handleSubmit} className="datasetgenform">
          {fields.map((field, i) => (
            <div key={i} className="datasetgeninput">
              <input
                type="text"
                name="field"
                placeholder="Field"
                value={field.field}
                onChange={(e) => handleInputChange(i, e)}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={field.description}
                onChange={(e) => handleInputChange(i, e)}
              />
            </div>
          ))}

          <div className="buttons">
            <button
              type="button"
              onClick={handleAddMore}
              className="addmorebutton"
              disabled={loading}
            >
              Add More
            </button>

            <button type="submit" className="submitbutton" disabled={loading}>
              {loading ? "Generating…" : "Submit"}
            </button>
          </div>
        </form>

        {loading && <p>Loading...</p>}

        {downloadUrl && showDownBut && (
          <button
            onClick={downloadFile}
            style={{ display: "block", margin: "10px auto" }}
            className="download-button-csv"
          >
            Download Processed CSV
          </button>
        )}

        {/* Optional: quick peek of the first few rows */}
        {dataset && (
          <pre style={{ marginTop: 16, maxHeight: 240, overflow: "auto" }}>
            {JSON.stringify(dataset.slice(0, 5), null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
