import React, { useRef, useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import Loader from "./Loader";
import AddFileButton from "./AddFileButton";
import TableForData from "./TableForData";
import Base64Loader from "./Base64Loader";
import { apiUrl } from "../api";

const UploadFile = () => {
  const fileInputRef = useRef(null);

  const [parsedData, setParsedData] = useState([]);      // full CSV rows (array of objects)
  const [tableRows, setTableRows] = useState([]);        // header array
  const [values, setValues] = useState([]);              // rows for preview table
  const [rowsToProcess, setRowsToProcess] = useState(""); // optional limit

  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFileExist, setFileExist] = useState(false);

  const [inputJsonData, setInputJsonData] = useState(null);
  const [outputJsonData, setOutputJsonData] = useState(null);

  const [inputImageVisualisation, setInputImageVisualisation] = useState(null);
  const [outputImageVisualisation, setOutputImageVisualisation] = useState(null);

  const [loadSection, setLoadSection] = useState("inputtable"); // 'table' | 'image'

  const navButtons = [
    { id: "input",  name: "Input table",  dataSend: inputJsonData,  kind: "table" },
    { id: "output", name: "Output table", dataSend: outputJsonData, kind: "table" },
    { id: "chart",  name: "Chart",        dataSend: outputJsonData, kind: "image" },
  ];

  const handleCsvParsing = (jsonData, kind) => {
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
      setTableRows([]);
      setValues([]);
      setLoadSection(kind === "image" ? "image" : "table");
      return;
    }

    if (kind !== "table") {
      setLoadSection("image");
      return;
    }

    // headers from first row, values for preview (max 15)
    const headers = Object.keys(jsonData[0]);
    const previewRows = jsonData.slice(0, 15).map((row) => headers.map((h) => row[h] ?? ""));

    setTableRows(headers);
    setValues(previewRows);
    setLoadSection("table");
  };

  const fetchMetricVisualisationForData = async (jsonArray) => {
    const payload = { dataset: jsonArray };
    const res = await fetch(apiUrl("/metric-from-json"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data?.visualizations || null;
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const rows = Array.isArray(data) ? data.filter((r) => Object.keys(r).length) : [];
        setParsedData(rows);

        if (rows.length) {
          const headers = Object.keys(rows[0]);
          const vals = rows.slice(0, 15).map((row) => headers.map((h) => row[h] ?? ""));
          setTableRows(headers);
          setValues(vals);
        } else {
          setTableRows([]);
          setValues([]);
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (!parsedData.length) return;

    // rowsToProcess is optional; if provided, coerce to positive int
    const n = Number.parseInt(rowsToProcess, 10);
    const sample = Number.isFinite(n) && n > 0 ? parsedData.slice(0, n) : parsedData;

    setInputJsonData(sample);
    setLoading(true);
    setDownloadUrl("");
    setFileExist(false);

    try {
      // input vis
      const inputVis = await fetchMetricVisualisationForData(sample);
      setInputImageVisualisation(inputVis);

      // generate dataset from sample
      const { data } = await axios.post(apiUrl("/generate-dataset-from-sample"), {
        size: sample.length,
        sample,
      });

      const out = data?.dataset || [];
      setOutputJsonData(out);

      // output vis
      const outputVis = await fetchMetricVisualisationForData(out);
      setOutputImageVisualisation(outputVis);

      // build CSV for download
      const csv = Papa.unparse(out);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setFileExist(true);

      // show charts by default after generation
      setLoadSection("image");
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.setAttribute("download", "processed_data.csv");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="upload-csv-container component-margin">
      <div className="file-upload-container">
        <span className="simple-heading">Choose file to generate data</span>
        <AddFileButton fileInputRef={fileInputRef} />
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept=".csv"
          onChange={onFileChange}
          style={{ display: "none", margin: "10px auto" }}
        />

        <div className="input-container">
          <input
            id="rows-to-process"
            placeholder="Enter number of rows to process (optional)"
            className="input-field"
            type="number"
            min={1}
            value={rowsToProcess}
            onChange={(e) => setRowsToProcess(e.target.value)}
          />
          <label htmlFor="rows-to-process" className="input-label">
            Enter number of rows to process
          </label>
          <span className="input-highlight"></span>
        </div>

        <div className="flex gap-2 items-center">
          <button className="generate-btn" onClick={handleSubmit} disabled={loading || !parsedData.length}>
            <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" className="sparkle">
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span className="text">{loading ? "Generating..." : "Generate"}</span>
          </button>
        </div>

        <button
          disabled={!isFileExist}
          onClick={downloadFile}
          style={{ display: "block", margin: "10px auto" }}
          className="download-button"
        >
          Download CSV
        </button>
      </div>

      <div className="image-container">
        <div className="data-analysis-section">
          {navButtons.map((b) => (
            <button
              key={b.id}
              className="btn-for-different-section"
              onClick={() => handleCsvParsing(b.dataSend, b.kind)}
            >
              {b.name}
            </button>
          ))}
          {loading && (
            <div className="loader_div">
              <Loader />
            </div>
          )}
        </div>

        {loadSection === "table" && (
          <TableForData tableRows={tableRows} values={values} />
        )}

        {loadSection === "image" && (
          <div className="analysis-container-image">
            <div className="input-graph-box">
              {inputImageVisualisation &&
                Object.keys(inputImageVisualisation).map((key) => (
                  <div key={`in-${key}`} className="mb-4">
                    <p>{key}</p>
                    <Base64Loader imageBase64={inputImageVisualisation[key]} />
                  </div>
                ))}
            </div>
            <div className="output-graph-box">
              {outputImageVisualisation &&
                Object.keys(outputImageVisualisation).map((key) => (
                  <div key={`out-${key}`} className="mb-4">
                    <p>{key}</p>
                    <Base64Loader imageBase64={outputImageVisualisation[key]} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
