import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
  apiKey?: string;
  coinId: string;
}

const BitcoinChart: React.FC<ChartProps> = ({ apiKey, coinId }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);

  const fetchHistory = async () => {
    try {
      const end = Date.now();
      const start = end - 6 * 60 * 60 * 1000;
      const res = await axios.get(`https://rest.coincap.io/v3/assets/${coinId}/history`, {
        params: { interval: "h1", start, end },
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });
      const data = res.data.data;
      setLabels(data.map((p: any) => new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })));
      setPrices(data.map((p: any) => parseFloat(p.priceUsd)));
    } catch (error) {
      console.error(`Error fetching ${coinId} history:`, error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [coinId]);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${coinId.toUpperCase()} Price (USD)`,
        data: prices,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
        {coinId.toUpperCase()} Price Trend (Last 6 Hours)
      </h2>
      <Line data={chartData} />
    </div>
  );
};

export default BitcoinChart;
