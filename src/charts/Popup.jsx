import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Popup = ({ isOpen, onClose, stockName, currentPrice, userId, onAddPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const {user} = useAuth();
  const navigate = useNavigate();
 

  if (!isOpen) return null; // Don't render the popup if it's not open

  const handleAddPurchase = async () => {
    if (!user) {
      alert("You must be logged in to make a purchase.");
      navigate("/login");
      return;
    }

    const totalPrice = currentPrice * quantity;

    const purchaseData = {
      stockName,
      quantity,
      price: currentPrice, // Send the individual price
    };

    try {
      // Make the POST request to the backend
      const response = await axios.post(`https://simple-portfolio-1q97.onrender.com/api/stock/${user.userId}`, purchaseData);
      console.log('Purchase added successfully:', response.data);

      // Trigger any parent callback to update the UI
      onAddPurchase({ stockName, quantity, totalPrice });

      // Close the popup after adding the purchase
      onClose();
    } catch (error) {
      console.error('Error adding purchase:', error.response?.data || error.message);
      alert('Failed to add the purchase. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Purchase Stock</h3>

        {/* Stock Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Stock Name</label>
          <input
            type="text"
            value={stockName}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Current Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Current Price</label>
          <input
            type="text"
            value={`$${currentPrice?.toFixed(2) || 'N/A'}`}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>

        {/* Total Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Total Price</label>
          <input
            type="text"
            value={`$${(currentPrice * quantity).toFixed(2) || '0.00'}`}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddPurchase}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
