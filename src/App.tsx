import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoCard from "./components/CryptoCard";
import BitcoinChart from "./components/BitcoinChart";
import { CryptoData } from "./types";

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [countdown, setCountdown] = useState<number>(30);
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchCryptoData = async () => {
    try {
      const res = await axios.get("https://rest.coincap.io/v3/assets", {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });
      const allData = res.data.data;
      const filtered = allData.filter((c: any) =>
        ["bitcoin", "ethereum", "dogecoin"].includes(c.id)
      );
      setCryptoData(filtered);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(() => {
      fetchCryptoData();
      setCountdown(30);
    }, 30000);
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-4">
          Live Crypto Price Dashboard
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10">
          Refreshing in <span className="font-semibold text-gray-800">{countdown}s</span>
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.id}
              onClick={() => setSelectedCoin(crypto.id)}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <CryptoCard
                name={crypto.name}
                price={crypto.priceUsd}
                change={crypto.changePercent24Hr}
              />
            </div>
          ))}
        </div>
        <div className="mt-10">
          <BitcoinChart apiKey={apiKey} coinId={selectedCoin} />
        </div>
      </div>
    </div>
  );
};

export default App;
