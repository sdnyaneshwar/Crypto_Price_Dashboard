import React from "react";

interface CryptoCardProps {
  name: string;
  price: string;
  change: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ name, price, change }) => {
  const isPositive = parseFloat(change) >= 0;
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{name}</h2>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
        ${parseFloat(price).toFixed(2)}
      </p>
      <p className={`mt-2 text-sm sm:text-base font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {parseFloat(change).toFixed(2)}%
      </p>
    </div>
  );
};

export default CryptoCard;
