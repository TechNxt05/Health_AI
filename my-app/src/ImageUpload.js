import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageUpload.css";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { apiUrl } from "../../api"; // ✅ fix path

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResponseData("");
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const res = await axios.post(apiUrl("/disease-from-image"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponseData(res.data.data);
    } catch (err) {
      console.error("Error uploading the image:", err);
      setErrorMsg("Error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseData) setFormattedText(responseData);
  }, [responseData]);

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lines = doc.splitTextToSize(formattedText, pageWidth - margin * 2);
    doc.text(lines, margin, margin);
    doc.save("Diagnosis_Report.pdf");
  };

  return (
    <div className="uploadImageContainer component-margin">
      <div className="mainContent">
        <h2>Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>

        {loading && <div className="loader" />}
        {errorMsg && <div className="error">{errorMsg}</div>}

        {responseData && (
          <div className="showReport pre">
            <h3>Diagnosis Report:</h3>
            <ReactMarkdown>{responseData}</ReactMarkdown>
            <div className="downloadButtonCont">
              <button className="button" type="button" onClick={handleDownload}>
                <span className="button__text">Download</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
