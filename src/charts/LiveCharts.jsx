import React, { useEffect, useMemo, useState } from 'react';
import { fetchStockData } from './services';
import ReactApexChart from 'react-apexcharts';
import { candleStickOptions } from './constants';
import Popup from './Popup'; // Import the Popup component

const LiveCharts = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchStockData(symbol)
      .then((data) => setStockData(data))
      .finally(() => setLoading(false));
  }, [symbol]);

  const seriesData = useMemo(() => {
    return stockData?.candlestickData || [];
  }, [stockData]);

  const currentValue = stockData?.currentValue || 0;

  const handlePurchase = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const handleAddPurchase = ({ stockName, quantity, totalPrice }) => {
    alert(`Stock purchased: ${stockName}, Quantity: ${quantity}, Total Price: $${totalPrice.toFixed(2)}`);
  };

  if (loading) return <div>Loading...</div>;

  if (!seriesData.length) return <div>No data available for {symbol}.</div>;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-4">
        Live Charts for {symbol}
      </h3>
      <div className="text-center mb-6">
        <p><strong>Current Price:</strong> ${currentValue?.toFixed(2) || 'N/A'}</p>
        <p><strong>Opening Price:</strong> ${stockData?.openValue?.toFixed(2) || 'N/A'}</p>
        <p><strong>Closing Price:</strong> ${stockData?.closeValue?.toFixed(2) || 'N/A'}</p>
      </div>
      <ReactApexChart
        series={[{ data: seriesData }]}
        options={candleStickOptions}
        type="candlestick"
      />
      {/* Purchase Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handlePurchase}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Purchase
        </button>
      </div>

      {/* Popup Component */}
      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        stockName={symbol}
        currentPrice={currentValue}
        onAddPurchase={handleAddPurchase}
      />
    </div>
  );
};

export default LiveCharts;
