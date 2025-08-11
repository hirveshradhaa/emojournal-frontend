import React, { useState } from "react";
import axios from "axios";

const JournalForm = () => {
  const [entry, setEntry] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/journal", { entry });
      setResponse(res.data);
    } catch (error) {
      console.error("Error:", error);
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
      </form>

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Results</h2>
          <p><strong>Summary:</strong> {response.summary}</p>
          <p><strong>Affirmation:</strong> {response.affirmation}</p>
          <p><strong>Mood:</strong> {response.mood.mood} ({response.mood.score})</p>
        </div>
      )}
    </div>
  );
};

export default JournalForm;
