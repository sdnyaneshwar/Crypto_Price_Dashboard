import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

interface BitcoinChartProps {
  apiKey: string;
  coinId: string;
}

const BitcoinChart: React.FC<BitcoinChartProps> = ({ apiKey, coinId }) => {
  const [chartData, setChartData] = useState<any>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://rest.coincap.io/v3/assets/${coinId}/history?interval=d1&apiKey=${apiKey}`
      );
      const prices = res.data.data.map((point: any) => parseFloat(point.priceUsd));
      const labels = res.data.data.map((point: any) =>
        new Date(point.time).toLocaleDateString()
      );

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

  return <Line data={chartData} />;
};

export default BitcoinChart;
