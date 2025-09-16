import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../api";

const MetricsDashboard = () => {
  const [data, setData] = useState(null); // { summary_statistics, missing_values, visualizations? }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const abortRef = useRef(null);

  const sendDataToBackend = async () => {
    const payload = {
      dataset: [
        { age: 24, gender: "male", heart_beat: 70, name: "Jon" },
        { age: 22, gender: "female", heart_beat: 80, name: "Alice" },
      ],
    };

    try {
      setLoading(true);
      setErr("");

      const controller = new AbortController();
      abortRef.current = controller;

      const { data: res } = await axios.post(apiUrl("/metric-from-json"), payload, {
        signal: controller.signal,
        validateStatus: (s) => s >= 200 && s < 300, // only treat 2xx as success
      });

      setData(res);
      console.log("Metrics response:", res);
    } catch (e) {
      if (e.name === "CanceledError") return; // aborted
      console.error("Error fetching metrics:", e);
      setErr(e?.response?.data?.message || "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // cleanup on unmount
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (data) console.log("Data updated:", data);
  }, [data]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={sendDataToBackend}
          disabled={loading}
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Loading…" : "Get Metrics"}
        </button>

        <button
          onClick={() => console.log("Current data:", data)}
          className="px-3 py-2 rounded bg-gray-200"
        >
          Log current data
        </button>
      </div>

      {!data && !loading && !err && (
        <div className="text-gray-500">Click “Get Metrics” to fetch a sample analysis.</div>
      )}

      {err && (
        <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Summary Statistics</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
              {JSON.stringify(data.summary_statistics ?? {}, null, 2)}
            </pre>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Missing Values</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
              {JSON.stringify(data.missing_values ?? {}, null, 2)}
            </pre>
          </section>

          {data.visualizations && Object.keys(data.visualizations).length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(data.visualizations).map(([key, base64]) => (
                  <figure key={key} className="border rounded p-3">
                    <figcaption className="mb-2 font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </figcaption>
                    <img
                      src={`data:image/png;base64,${base64}`}
                      alt={key}
                      className="w-full h-auto"
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricsDashboard;
