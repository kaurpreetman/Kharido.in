import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";

const faqsData = [
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking link via email and SMS to track your delivery in real-time. You can also check your order status in the 'My Orders' section of your profile.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major debit/credit cards, net banking, UPI, digital wallets like Paytm, PhonePe, Google Pay, and also offer Cash on Delivery for eligible orders.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes! We have a hassle-free 7-day return and exchange policy. Products must be in original condition with tags intact. Check the product details for specific return eligibility.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. Our website uses advanced 256-bit SSL encryption and secure payment gateways to ensure your data is completely safe. We never store your payment information on our servers.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach out to our 24/7 customer support via email at support@forevershop.com, phone at +1 (555) 123-4567, or use our live chat feature for instant assistance.",
  },
  {
    question: "What are the shipping charges?",
    answer: "We offer free shipping on orders above ₹999. For orders below this amount, shipping charges are ₹99. Express delivery options are available at additional cost.",
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 3-7 business days. Express delivery is available in select cities with 1-2 day delivery. Delivery times may vary based on your location and product availability.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Yes, you can cancel your order before it's shipped. Once shipped, you can return the product as per our return policy. Cancellation requests can be made through your profile or by contacting support.",
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            <h1 className="text-5xl font-display font-bold gradient-text">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqsData.map((faq, index) => (
            <div
              key={index}
              className="card overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                className="w-full text-left p-6 focus:outline-none focus:ring-4 focus:ring-primary-500/20 flex justify-between items-center group"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {faq.question}
                </span>
                <div className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-primary-600 dark:text-primary-400 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300" />
                  )}
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-gradient-to-r from-primary-500 to-secondary-500 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold gradient-text mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our support team is here to help you 24/7
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="mailto:kharidoatoz@gmail.com"
              className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">kharidoatoz@gmail.com</p>
            </a>

            <a
              href="tel:+91-7819081686"
              className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Phone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">+91-7819081686</p>
            </a>

            <button className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-300 transform hover:scale-105">
              <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Text</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;