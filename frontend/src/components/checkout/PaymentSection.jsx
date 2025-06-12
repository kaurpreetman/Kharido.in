import React from 'react';
import { CreditCard, Package, Wallet, CheckCircle } from 'lucide-react';

export const PaymentSection = ({ selectedMethod, onSelectMethod }) => {
  const handleMethodChange = (method) => {
    if (onSelectMethod) {
      onSelectMethod(method);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
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
    label: 'Credit/Debit Card',
    description: 'Pay securely with Stripe using your card.',
    icon: <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    id: 'razorpay',
    label: 'Razorpay',
    description: 'Pay using UPI, Net Banking, or Cards.',
    icon: <Wallet className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 'cash_on_delivery',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives.',
    icon: <Package className="h-6 w-6 text-green-600 dark:text-green-400" />,
  },
];

function PaymentOption({ id, label, description, icon, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className={`relative flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
        checked 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg' 
          : 'border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
      }`}
    >
      <input
        type="radio"
        id={id}
        name="payment-method"
        value={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      
      <div className="flex items-center gap-4 w-full">
        <div className={`p-3 rounded-xl ${
          checked 
            ? 'bg-primary-100 dark:bg-primary-800/30' 
            : 'bg-gray-100 dark:bg-dark-600'
        }`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
            {label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        
        {checked && (
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
      
      {/* Selection indicator */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-primary-500 transition-opacity duration-300 pointer-events-none ${
        checked ? 'opacity-100' : 'opacity-0'
      }`} />
    </label>
  );
}