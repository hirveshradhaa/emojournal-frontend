import React, { useState } from "react";
import axios from "axios";

// Use env var if set, else fallback to Render URL
const API_BASE =
  process.env.REACT_APP_API_BASE || "https://emojournal-ai4.onrender.com";

export default function JournalForm() {
  const [entry, setEntry] = useState("");
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/journal`, { entry });
      setResponse(res.data);
      setEntry("");
      await loadHistory(); // auto-refresh after posting
    } catch (err) {
      console.error(err);
      alert("Error analyzing entry");
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/entries`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading history");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EmoJournal</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your journal entry..."
          rows={6}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Analyze
        </button>
        <button
          type="button"
          onClick={loadHistory}
          className="ml-2 mt-2 bg-gray-200 px-4 py-2 rounded"
        >
          Load History
        </button>

        {/* Optional Health Check Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              const r = await axios.get(`${API_BASE}/health`);
              alert(`OK! db_ok=${r.data.db_ok}`);
            } catch (e) {
              alert("Health failed. Check API_BASE / CORS / service status.");
            }
          }}
          className="ml-2 mt-2 bg-green-600 text-white px-3 py-2 rounded"
        >
          Check API
        </button>
      </form>

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Latest Result</h2>
          <p>
            <strong>Summary:</strong> {response.summary}
          </p>
          <p>
            <strong>Affirmation:</strong> {response.affirmation}
          </p>
          <p>
            <strong>Mood:</strong> {response.mood.mood} (
            {response.mood.score})
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">History</h2>
          {history.map((item) => (
            <div key={item.id} className="border p-3 rounded mb-2">
              <p>
                <strong>Summary:</strong> {item.summary}
              </p>
              <p>
                <strong>Mood:</strong> {item.mood} ({item.mood_score})
              </p>
              <details>
                <summary>View Original Entry</summary>
                <p>{item.entry}</p>
              </details>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/entries/${item.id}`);
                    setHistory((prev) =>
                      prev.filter((x) => x.id !== item.id)
                    );
                  } catch (err) {
                    console.error(err);
                    alert("Delete failed");
                  }
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
