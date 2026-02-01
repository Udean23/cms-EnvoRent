import React from 'react';

const CalculatorCard = ({ 
  paymentAmount, 
  onQuickAmount, 
  onNumberInput, 
  onPayNow, 
  isPayDisabled 
}) => {
  return (
    <div className="flex-1 p-4 flex flex-col">
      <div className="flex-1">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800">
            {formatPrice(parseFloat(paymentAmount) || 0)}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[5000, 10000, 20000, 50000].map(amount => (
            <button
              key={amount}
              onClick={() => onQuickAmount(amount)}
              className="px-2 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm font-medium text-blue-700 border border-blue-300 hover:border-blue-400 transition-colors"
            >
              +{amount.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => onNumberInput(num.toString())}
              className="h-12 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-lg text-gray-800 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => onNumberInput('clear')}
            className="h-12 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors"
          >
            .
          </button>
          <button
            onClick={() => onNumberInput('0')}
            className="h-12 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-lg text-gray-800 transition-colors"
          >
            0
          </button>
          <button
            onClick={() => onNumberInput('delete')}
            className="h-12 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
          >
            ⌫
          </button>
        </div>
      </div>
      <button
        onClick={onPayNow}
        disabled={isPayDisabled}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black py-3 rounded-lg font-semibold transition-colors"
      >
        Pay Now
      </button>
    </div>
  );
};

const formatPrice = (price) => {
  return `Rp. ${price.toLocaleString('id-ID')}`;
};

export default CalculatorCard;