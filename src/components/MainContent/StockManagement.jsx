import React, { useState, useEffect } from "react";
import axios from "axios";
import EditStockPopup from "./EditStockPopup";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    // Fetch stocks data from the backend
    const fetchStocks = async () => {
      try {
        const response = await axios.get("https://simple-portfolio-1q97.onrender.com/api/stock/{user_id}");
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  const handleEditClick = (stock) => {
    setSelectedStock(stock);
    setShowEditPopup(true);
  };

  const handleUpdateSuccess = (updatedStock) => {
    // Update the stocks list after a successful update
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.stockId === updatedStock.stockId ? updatedStock : stock
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Management</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Stock Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.stockId}>
              <td className="border p-2">{stock.stockName}</td>
              <td className="border p-2">{stock.quantity}</td>
              <td className="border p-2">${stock.price.toFixed(2)}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditClick(stock)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditPopup && selectedStock && (
        <EditStockPopup
          stock={selectedStock}
          onClose={() => setShowEditPopup(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default StockManagement;
