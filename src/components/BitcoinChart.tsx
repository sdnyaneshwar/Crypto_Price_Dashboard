import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";


interface BitcoinChartProps {
  apiKey: string;
  coinId: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const BitcoinChart: React.FC<BitcoinChartProps> = ({ apiKey, coinId }) => {
  const [chartData, setChartData] = useState<any>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const end = Date.now();
      const start = end - 6 * 60 * 60 * 1000;
      const res = await axios.get(
        `https://rest.coincap.io/v3/assets/${coinId}/history`,
        {
          params: { interval: "h1", start, end },
          headers: { Authorization: `Bearer ${apiKey}` }
        }
      );
      const data = res.data.data;
      const labels = data.map((p: any) => new Date(p.time).toLocaleTimeString())
      const prices = data.map((p: any) => parseFloat(p.priceUsd))

      setChartData({
        labels,
        datasets: [
          {
            label: `${coinId} Price (USD)`,
            data: prices,
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }, [apiKey, coinId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (!chartData) return <p>Loading chart...</p>;

   return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mt-6 w-full overflow-x-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
        {coinId.toUpperCase()} Price Trend (Last 6 Hours)
      </h2>
      <Line data={chartData} />
    </div>
  );
};

export default BitcoinChart;
