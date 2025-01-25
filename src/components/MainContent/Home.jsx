import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import EditStockPopup from "./EditStockPopup"; // Import the new EditStockPopup component
import { fetchStockData } from "../../charts/services";
import LiveCharts from "../../charts/LiveCharts";

const Home = () => {
  const { user } = useAuth(); // Authenticated user
  const [stocks, setStocks] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetch stocks if user is logged in
  useEffect(() => {
    if (user) {
      const fetchStocks = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`https://simple-portfolio-1q97.onrender.com/api/stock/${user.userId}`);
          setStocks(response.data);

          // Fetch current prices for all stocks
          const pricePromises = response.data.map(async (stock) => {
            const stockData = await fetchStockData(stock.stockName); // Use stockName to fetch data
            return { stockName: stock.stockName, currentPrice: stockData?.currentValue || 0 };
          });

          const prices = await Promise.all(pricePromises);
          const pricesMap = prices.reduce(
            (acc, { stockName, currentPrice }) => ({
              ...acc,
              [stockName]: currentPrice,
            }),
            {}
          );
          setCurrentPrices(pricesMap);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch stock data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchStocks();
    }
  }, [user]);

  const handleEditClick = (stock) => {
    setSelectedStock(stock); // Set the stock to be edited
    setIsEditPopupOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsEditPopupOpen(false); // Close the popup
    setSelectedStock(null); // Reset the selected stock
  };

  const handleUpdateStock = (updatedStock) => {
    // Update the stock in the list
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.stockId === updatedStock.stockId ? updatedStock : stock
      )
    );
    handleClosePopup();
  };

  const handleDeleteStock = async (stockId) => {
    try {
      // Perform the delete request to the backend
      const response = await axios.delete(`https://simple-portfolio-1q97.onrender.com/api/stock/${stockId}`);
      if (response.status === 200) {
        // Remove the stock from the state list after successful deletion
        setStocks((prevStocks) => prevStocks.filter((stock) => stock.stockId !== stockId));
      }
    } catch (error) {
      console.error("Error deleting stock", error);
      setError("Failed to delete stock. Please try again.");
    }
  };

  const handleToggleView = (symbol) => {
    setSelected(selected === symbol ? null : symbol); // Toggle visibility
  };

  if (!user) {
    // Render the home content if the user is not logged in
    return (
      <main className="max-w-4xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 mx-auto px-4 py-12">
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Simple Portfolio Tracker</h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Our portfolio tracker is designed to help you easily manage and monitor your investments.
            Add your favorite stocks, view updates, and stay on top of your financial goals.
            Whether you're a beginner or an experienced investor, this tool makes tracking your portfolio seamless and intuitive.
          </p>
        </section>

        <div className="flex justify-center mt-8">
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
              Login to Add New Stock
            </button>
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <p className="text-center mt-8 text-gray-900 dark:text-gray-300">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  const totalInvestmentValue = stocks.reduce((sum, stock) => sum + stock.quantity * stock.price, 0);
  const totalPortfolioValue = stocks.reduce((sum, stock) => {
    const currentPrice = currentPrices[stock.stockName] || 0;
    return sum + stock.quantity * currentPrice;
  }, 0);

  // Render the dashboard if stocks exist
  if (stocks.length > 0) {
    return (
      <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Stock Dashboard</h2>

        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">
            Total Investment Value: <span className="text-blue-600 dark:text-blue-300">${totalInvestmentValue.toFixed(2)}</span>
          </p>
          <p className="text-lg font-semibold">
            Total Portfolio Value: <span className="text-green-600 dark:text-green-300">${totalPortfolioValue.toFixed(2)}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-6 py-3 border-b-2 text-left">Stock Name</th>
                <th className="px-6 py-3 border-b-2 text-left">Quantity</th>
                <th className="px-6 py-3 border-b-2 text-left">Price</th>
                <th className="px-6 py-3 border-b-2 text-left">Total Price</th>
                <th className="px-6 py-3 border-b-2 text-left">Current Price</th>
                <th className="px-6 py-3 border-b-2 text-left">If Sell</th>
                <th className="px-6 py-3 border-b-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const currentPrice = currentPrices[stock.stockName] || 0;
                const totalPrice = stock.quantity * stock.price;
                const profit = stock.quantity * currentPrice - totalPrice;

                return (
                  <tr key={stock.stockId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      {selected === stock.stockName ? (
                        <>
                          <button
                            onClick={() => handleToggleView(stock.stockName)}
                            className="text-blue-600 text-center dark:text-blue-300 hover:underline pb-2"
                          >
                            {stock.stockName}
                          </button>
                          <LiveCharts symbol={stock.stockName} /> {/* Render LiveCharts */}
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleView(stock.stockName)}
                          className="text-blue-600 dark:text-blue-300 hover:underline"
                        >
                          {stock.stockName}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">{stock.quantity}</td>
                    <td className="px-6 py-4">${stock.price.toFixed(2)}</td>
                    <td className="px-6 py-4">${totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">${currentPrice.toFixed(2)}</td>
                    <td
                      className={`px-6 py-4 border-b border-gray-300 dark:border-gray-700 font-bold ${profit > 0
                        ? "text-green-500"
                        : profit < 0
                          ? "text-red-500"
                          : "text-gray-500"
                        }`}
                    >
                      {profit > 0 ? (
                        <>
                          <span>+${profit.toFixed(2)}</span> <span>↑</span>
                        </>
                      ) : profit < 0 ? (
                        <>
                          <span>-${Math.abs(profit).toFixed(2)}</span> <span>↓</span>
                        </>
                      ) : (
                        "$0.00"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded mr-2"
                        onClick={() => handleEditClick(stock)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                        onClick={() => handleDeleteStock(stock.stockId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isEditPopupOpen && (
          <EditStockPopup
            stock={selectedStock}
            onClose={handleClosePopup}
            onUpdate={handleUpdateStock}
          />
        )}
      </div>
    );
  }

  return (
    <main className="max-w-4xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 mx-auto px-4 py-12">
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">No Stocks Found</h2>
        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          You currently have no stocks added to your portfolio. Click the button below to add new stocks and start building your portfolio.
        </p>
      </section>

      <div className="flex justify-center mt-8">
        <Link to="/stocks">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
            Add New Stock
          </button>
        </Link>
      </div>
    </main>
  );
};

export default Home;
