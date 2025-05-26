import React, { useEffect, useState } from "react";
import axios from "axios";
import FaqItem from "../components/FaqItem";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const res = await axios.get("/api/faqs");
    setFaqs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await axios.post("/api/faqs/ask", { question });
    if (res.data.exists) {
      setMessage("Question already asked. See below.");
    } else {
      setMessage("Question submitted! Admin will respond soon.");
      setFaqs([res.data.faq, ...faqs]);
    }
    setQuestion("");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">❓ Frequently Asked Questions</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="w-full p-2 border rounded mb-2"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </form>

      {faqs.map((faq) => (
        <FaqItem key={faq._id} faq={faq} />
      ))}
    </div>
  );
}
