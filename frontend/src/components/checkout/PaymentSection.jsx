import React from 'react';
import { CreditCard, Package, Wallet } from 'lucide-react';

export const PaymentSection = ({ selectedMethod, onSelectMethod }) => {
  const handleMethodChange = (method) => {
    if (onSelectMethod) {
      onSelectMethod(method);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentOptions.map((option) => (
          <PaymentOption
            key={option.id}
            id={option.id}
            label={option.label}
            description={option.description}
            icon={option.icon}
            checked={selectedMethod === option.id}
            onChange={() => handleMethodChange(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

const paymentOptions = [
  {
    id: 'stripe',
    label: 'Stripe',
    description: 'Pay securely using Stripe.',
    icon: <CreditCard className="h-5 w-5 text-gray-400 mr-2" />,
  },
  {
    id: 'razorpay',
    label: 'Razorpay',
    description: 'Pay securely using Razorpay.',
    icon: <Wallet className="h-5 w-5 text-gray-400 mr-2" />,
  },
  {
    id: 'cash_on_delivery',
    label: 'Cash on Delivery',
    description: 'Pay in cash upon delivery.',
    icon: <Package className="h-5 w-5 text-gray-400 mr-2" />,
  },
];

function PaymentOption({ id, label, description, icon, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg ${
        checked ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
      }`}
      aria-selected={checked}
    >
      <div className="flex items-center">
        <input
          type="radio"
          id={id}
          name="payment-method"
          value={id}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <div className="flex items-center">
          {icon}
          <span className="font-medium text-gray-700">{label}</span>
        </div>
      </div>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </label>
  );
}
