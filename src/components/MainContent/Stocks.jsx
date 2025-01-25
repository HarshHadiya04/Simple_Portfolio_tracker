import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext for authentication
import LiveCharts from '../../charts/LiveCharts'; // Ensure the path is correct

const stocksData = [
  { name: 'Adobe Inc.', symbol: 'ADBE' },
  { name: 'JPMorgan Chase & Co.', symbol: 'JPM' },
  { name: 'Reliance Industries Ltd.', symbol: 'RELIANCE.BSE' },
  { name: 'Tata Consultancy Services', symbol: 'TCS.BSE' },
  { name: 'Infosys Ltd.', symbol: 'INFY.BSE' },
  { name: 'Meta Platforms Inc.', symbol: 'META' },
  { name: 'NVIDIA Corp.', symbol: 'NVDA' },
  { name: 'Netflix Inc.', symbol: 'NFLX' },
  { name: 'Amazon.com Inc.', symbol: 'AMZN' },
  { name: 'Alphabet Inc.', symbol: 'GOOGL' },
  { name: 'Tesla Inc.', symbol: 'TSLA' },
  { name: 'Apple Inc.', symbol: 'AAPL' },
  { name: 'Microsoft Corp.', symbol: 'MSFT' },
  { name: 'The Coca-Cola Company', symbol: 'KO' },
];

const Stocks = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth(); // Get authentication status from AuthContext

  useEffect(() => {
    // Redirect to login page if user is not logged in
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleToggleView = (symbol) => {
    setSelectedStock(selectedStock === symbol ? null : symbol); // Toggle visibility
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Stocks List</h1>
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Stock Name</th>
                <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {stocksData.map((stock, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
                  }`}
                >
                  <td className="px-6 py-4">{stock.name}</td>
                  <td className="px-6 py-4">
                    {selectedStock === stock.symbol ? (
                      <>
                        <button
                          onClick={() => handleToggleView(stock.symbol)}
                          className="text-blue-600 text-center dark:text-blue-300 hover:underline pb-2"
                        >
                          Hide
                        </button>
                        <LiveCharts symbol={stock.symbol} /> {/* Render LiveCharts */}
                      </>
                    ) : (
                      <button
                        onClick={() => handleToggleView(stock.symbol)}
                        className="text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        View More
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stocks;
