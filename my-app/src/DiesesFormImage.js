import React, { useState } from "react";
import axios from "axios";
import "./ImageUpload.css";
// adjust the path if this file isn't next to api.js
import { apiUrl } from "../../api";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setErrorMsg("");
    setResponseData("");
    setPreviewUrl("");
    setSelectedFile(null);

    if (!file) return;

    // basic validations
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }
    // ~10MB limit (tweak if your backend allows larger)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File is too large. Max 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMsg("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      setErrorMsg("");

      const { data } = await axios.post(apiUrl("/disease-from-image"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Expecting { data: "<report text or markdown>" }
      setResponseData(data?.data ?? "No report returned.");
    } catch (err) {
      console.error("Error uploading the image:", err);
      setErrorMsg(
        err?.response?.data?.message || "Error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container image-upload">
      <h2>Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        aria-label="Upload medical image"
      />

      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Selected preview" />
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading…" : "Submit"}
      </button>

      {loading && <div className="loader" />}

      {errorMsg && (
        <div className="alert alert-error" role="alert">
          {errorMsg}
        </div>
      )}

      {responseData && (
        <div className="report">
          <h3>Diagnosis Report</h3>
          <pre className="report-text">{responseData}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
