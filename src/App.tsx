import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CryptoCard from "./components/CryptoCard";
import BitcoinChart from "./components/BitcoinChart";
import { CryptoData } from "./types";

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [countdown, setCountdown] = useState<number>(30);
  const apiKey = process.env.REACT_APP_API_KEY || "";

  // useCallback so fetchCryptoData reference stays stable
  const fetchCryptoData = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://rest.coincap.io/v3/assets?apiKey=${apiKey}`
      );
      const allData = res.data.data;
      const filtered = allData.filter((c: any) =>
        ["bitcoin", "ethereum", "dogecoin"].includes(c.id)
      );
      setCryptoData(filtered);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchCryptoData();

    const dataInterval = setInterval(() => {
      fetchCryptoData();
      setCountdown(30);
    }, 30000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(countdownTimer);
    };
  }, [fetchCryptoData]);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        Live Crypto Price Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Refreshing in <span className="font-semibold">{countdown}s</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            onClick={() => setSelectedCoin(crypto.id)}
            className="cursor-pointer"
          >
            <CryptoCard
              name={crypto.name}
              price={crypto.priceUsd}
              change={crypto.changePercent24Hr}
            />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <BitcoinChart apiKey={apiKey} coinId={selectedCoin} />
      </div>
    </div>
  );
};

export default App;
