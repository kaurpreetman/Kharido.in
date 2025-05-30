import React, { useState } from "react";

const faqsData = [
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking link via email and SMS to track your delivery in real-time.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major debit/credit cards, net banking, UPI, and popular digital wallets.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes! We have a hassle-free return and exchange policy. Check the product details for more information.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. Our website uses advanced encryption and secure payment gateways to ensure your data is safe.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach out to our 24/7 customer support via email, phone, or live chat for any queries or issues.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          <span className="text-pink-600">❓</span> Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqsData.map((faq, index) => (
            <div
              key={index}
              className="border border-blue-400 rounded overflow-hidden"
            >
              <button
                className="w-full text-left p-3 bg-blue-500 hover:bg-blue-600 focus:outline-none flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 p-3 bg-blue-600" : "max-h-0"
                }`}
              >
                <p className="text-sm text-blue-100">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
