import React, { useState } from "react";
import Loader from "./Loader";
import { apiUrl } from "../../api";

const DrugInDisease = () => {
  const [inputData, setInputData] = useState("");
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    const disease = inputData.trim();
    if (!disease) {
      alert("Please enter a disease name first.");
      return;
    }
    setLoading(true);
    setDrugData(null);

    try {
      const res = await fetch(apiUrl("/drug-from-disease"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }
      const json = await res.json();
      setDrugData(json);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch drug suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drug-generation-container component-margin">
      <div className="file-upload-container">
        <span className="simple-heading width500px">Enter the Disease</span>

        <input
          className="input-field width200px"
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="e.g., Diabetes, Asthma, Migraine"
        />

        <button onClick={handleButtonClick} disabled={loading}>
          {loading ? "Analysing..." : "Drug Analysis"}
        </button>
      </div>

      {loading && (
        <div className="loader_div_in_drug_generation">
          <Loader />
        </div>
      )}

      {drugData && !loading && (
        <div className="result-container">
          <div className="general-Info">
            <div>
              <strong>Disease:</strong> {drugData?.disease ?? "-"}
            </div>
            {drugData?.important_note && (
              <div className="redcolrtext">
                <strong>Note:</strong> {drugData.important_note}
              </div>
            )}
          </div>

          <div className="big-container">
            <div className="simple-heading">Known Treatment Drugs</div>
            <div className="known-treatment-drug-container">
              {Array.isArray(drugData?.known_treatments) &&
                drugData.known_treatments.map((el, idx) => (
                  <div className="drug-card-from-fever" key={`known-${idx}`}>
                    <div><strong>Drug:</strong> {el?.drug ?? "-"}</div>
                    <div><strong>Target:</strong> {el?.target ?? "-"}</div>
                    <div><strong>Mechanism:</strong> {el?.mechanism ?? "-"}</div>
                  </div>
                ))}
              {!Array.isArray(drugData?.known_treatments) ||
                (drugData.known_treatments.length === 0 && (
                  <div className="text-gray-500">No known treatments found.</div>
                ))}
            </div>
          </div>

          <div className="big-container">
            <div className="simple-heading">Potential Drugs to Consider</div>
            <div className="known-treatment-drug-container novices-drug-container">
              {Array.isArray(drugData?.novice_drugs) &&
                drugData.novice_drugs.map((el, idx) => (
                  <div className="drug-card-from-fever" key={`novice-${idx}`}>
                    <div><strong>Drug:</strong> {el?.drug_candidate ?? "-"}</div>
                    <div><strong>Potential Target:</strong> {el?.targets ?? "-"}</div>
                    <div><strong>Mechanism:</strong> {el?.potential_mechanism ?? "-"}</div>
                  </div>
                ))}
              {!Array.isArray(drugData?.novice_drugs) ||
                (drugData.novice_drugs.length === 0 && (
                  <div className="text-gray-500">No candidates found.</div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugInDisease;
