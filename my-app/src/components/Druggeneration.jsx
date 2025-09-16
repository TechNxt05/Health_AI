import React, { useState } from "react";
import Loader from "./Loader";
import { apiUrl } from "../api";

const Druggeneration = () => {
  const [inputData, setInputData] = useState("");
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    if (!inputData.trim()) {
      alert("Please enter a SMILES string first.");
      return;
    }
    setLoading(true);
    setDrugData(null);
    try {
      const res = await fetch(apiUrl("/drug-from-smile"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles: inputData.trim() }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }
      const json = await res.json();
      setDrugData(json);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze the molecule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drug-generation-container">
      <div className="file-upload-container">
        <span className="simple-heading width500px">Enter the molecule</span>

        <input
          className="input-field width200px"
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Paste SMILES (e.g., CC(=O)OC1=CC=CC=C1C(=O)O)"
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
          <div className="basic-information bottomborder-bottom-padding">
            <div className="simple-heading width100">Drug Properties</div>
            <div className="width100 flexinrow">
              <div className="drug-info-content">
                <p><strong>IUPAC Name:</strong> {drugData?.IUPAC_name ?? "-"}</p>
                <p><strong>Molecular Formula:</strong> {drugData?.molecular_formula ?? "-"}</p>
                <p><strong>Molecular Weight:</strong> {drugData?.molecular_weight ?? "-"} g/mol</p>
                <p><strong>LogP:</strong> {drugData?.logP ?? "-"}</p>
                <p><strong>H-bond acceptors:</strong> {drugData?.H_bond_acceptors ?? "-"}</p>
                <p><strong>H-bond donors:</strong> {drugData?.H_bond_donors ?? "-"}</p>
                <p><strong>Rotatable bonds:</strong> {drugData?.rotatable_bonds ?? "-"}</p>
                <p><strong>Binding affinity prediction:</strong> {drugData?.binding_affinity_prediction ?? "-"}</p>
              </div>

              <div className="drug-info-content">
                <p><strong>— ADME properties —</strong></p>
                <p><strong>Absorption:</strong> {drugData?.ADME_properties?.absorption ?? "-"}</p>
                <p><strong>Distribution:</strong> {drugData?.ADME_properties?.distribution ?? "-"}</p>
                <p><strong>Metabolism:</strong> {drugData?.ADME_properties?.metabolism ?? "-"}</p>
                <p><strong>Excretion:</strong> {drugData?.ADME_properties?.excretion ?? "-"}</p>

                {drugData?.toxicity_prediction && (
                  <ul className="list-style">
                    <p><strong className="flexcenter">— Toxicity Prediction —</strong></p>
                    <li><strong>Carcinogenicity:</strong> {drugData?.toxicity_prediction?.carcinogenicity ?? "-"}</li>
                    <li><strong>Cardiotoxicity:</strong> {drugData?.toxicity_prediction?.cardiotoxicity ?? "-"}</li>
                    <li><strong>Hepatotoxicity:</strong> {drugData?.toxicity_prediction?.hepatotoxicity ?? "-"}</li>
                    <li><strong>Mutagenicity:</strong> {drugData?.toxicity_prediction?.mutagenicity ?? "-"}</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {drugData?.drug_likeness && (
            <div className="drug_likeness bottomborder-bottom-padding">
              <div className="simple-heading width100">Drug Likeness</div>
              <div className="width100 flexinrow">
                <div className="drug-info-content">
                  <p><strong>Lipinski violations:</strong> {drugData?.drug_likeness?.Lipinski_violations ?? "-"}</p>
                </div>
                <div className="drug-info-content">
                  <p>
                    <strong>Rule-of-Five compatible:</strong>{" "}
                    {drugData?.drug_likeness?.rule_of_five_compatible ? "true" : "false"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(drugData?.potential_targets) && (
            <div className="potential_targets bottomborder-bottom-padding">
              <div className="simple-heading width100">Potential Targets</div>
              <div className="width100 flexinrow scrollinx">
                {drugData.potential_targets.map((t, i) => (
                  <div className="drug-info-content" key={i}>
                    <p><strong>Target name:</strong> {t?.target_name ?? "-"}</p>
                    <p><strong>Target type:</strong> {t?.target_type ?? "-"}</p>
                    <p><strong>Activity:</strong> {t?.activity ?? "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(drugData?.new_drug_candidates) && (
            <div className="new_drug_candidates bottomborder-bottom-padding">
              <div className="simple-heading width100">Related Drug Candidates</div>
              <div className="width100 flexincol scrollinx target-drug-card-container">
                {drugData.new_drug_candidates.map((c, i) => (
                  <div className="new-drug-candidate-card" key={`${c?.SMILES ?? "cand"}-${i}`}>
                    <div className="left-box">
                      <span className="key-index-repeater">{i + 1}</span>
                      <p><strong>SMILES:</strong> {c?.SMILES ?? "-"}</p>
                      <p><strong>LogP:</strong> {c?.logP ?? "-"}</p>
                      <p><strong>Molecular formula:</strong> {c?.molecular_formula ?? "-"}</p>
                      <p><strong>Molecular weight:</strong> {c?.molecular_weight ?? "-"}</p>
                      <p><strong>Predicted activity:</strong> {c?.predicted_activity ?? "-"}</p>
                      {c?.toxicity_prediction && (
                        <ul className="list-style">
                          <p><strong className="flexcenter">— Toxicity Prediction —</strong></p>
                          <li><strong>Carcinogenicity:</strong> {c?.toxicity_prediction?.carcinogenicity ?? "-"}</li>
                          <li><strong>Mutagenicity:</strong> {c?.toxicity_prediction?.mutagenicity ?? "-"}</li>
                        </ul>
                      )}
                    </div>
                    <div className="right-box">
                      {c?.SMILES ? (
                        <img
                          src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(
                            c.SMILES
                          )}/PNG`}
                          alt="molecular"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">No image</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Druggeneration;
