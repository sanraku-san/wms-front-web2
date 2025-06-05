import React, { useState } from "react";
import { createVarianceReport } from "../../api/variance";
import { toast } from 'react-toastify';

const AddVarianceModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [physicalStock, setPhysicalStock] = useState("");
  const [physicalSales, setPhysicalSales] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!storeId || !startDate || !endDate || physicalStock === "" || physicalSales === "") {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const reportDataForBackend = {
      store_id: parseInt(storeId, 10),
      start_date: startDate,
      end_date: endDate,
      physical_stock: parseFloat(physicalStock),
      physical_sales: parseFloat(physicalSales),
    };

    try {
      const response = await createVarianceReport(reportDataForBackend);
      toast.success("Variance report created successfully!");
      onSave(response.data);
      resetForm();
      onClose();
    } catch (error) {
      const message = error.message || "Failed to create variance report.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStoreId("");
    setStartDate("");
    setEndDate("");
    setPhysicalStock("");
    setPhysicalSales("");
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Add New Variance Report</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
          )}

          <div className="mb-4">
            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">Store ID:</label>
            <input
              type="number"
              id="storeId"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="physicalStock" className="block text-sm font-medium text-gray-700 mb-1">Physical Stock:</label>
            <input
              type="number"
              id="physicalStock"
              value={physicalStock}
              onChange={(e) => setPhysicalStock(e.target.value)}
              required
              step="any"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="physicalSales" className="block text-sm font-medium text-gray-700 mb-1">Physical Sales:</label>
            <input
              type="number"
              id="physicalSales"
              value={physicalSales}
              onChange={(e) => setPhysicalSales(e.target.value)}
              required
              step="any"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVarianceModal;