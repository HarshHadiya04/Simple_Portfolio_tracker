import React, { useState, useEffect } from "react";
import axios from "axios";

const EditStockPopup = ({ stock, onClose, onUpdate }) => {
  const [stockName, setStockName] = useState(stock.stockName);
  const [quantity, setQuantity] = useState(stock.quantity);
  const [price] = useState(stock.price);
  const [totalPrice, setTotalPrice] = useState(stock.quantity * stock.price);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update totalPrice whenever quantity changes
  useEffect(() => {
    setTotalPrice(quantity * price);
  }, [quantity, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const updatedStock = {
      stockName,
      quantity: Number(quantity),
      price: Number(price),
      totalPrice: Number(totalPrice),
    };

    try {
      // API request to update stock using Axios
      const response = await axios.put(
        `https://simple-portfolio-1q97.onrender.com/api/stock/${stock.stockId}`,
        updatedStock
      );

      if (response.status === 200) {
        // Notify parent component about the successful update
        onUpdate(response.data);
        onClose(); // Close the popup
      }
    } catch (err) {
      setError("Failed to update stock. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Stock</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-2">Stock Name</label>
            <input
              type="text"
              value={stockName}
              readOnly
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">Price</label>
            <input
              type="number"
              value={price}
              readOnly
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">Total Price</label>
            <input
              type="text"
              value={`$${totalPrice.toFixed(2)}`}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockPopup;
