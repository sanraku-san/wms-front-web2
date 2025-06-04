import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddVarianceModal = ({ onClose, onSave }) => {
  const [storeId, setStoreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [physicalStock, setPhysicalStock] = useState("");
  const [physicalSales, setPhysicalSales] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !storeId ||
      !startDate ||
      !endDate ||
      physicalStock === "" ||
      physicalSales === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newReport = {
      storeId,
      startDate,
      endDate,
      physicalStock: parseFloat(physicalStock),
      physicalSales: parseFloat(physicalSales),
    };
    onSave(newReport);
    setStoreId("");
    setStartDate("");
    setEndDate("");
    setPhysicalStock("");
    setPhysicalSales("");
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Add New Variance Report
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="storeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store ID:
            </label>
            <input
              type="text"
              id="storeId"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="physicalStock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Physical Stock:
            </label>
            <input
              type="number"
              id="physicalStock"
              value={physicalStock}
              onChange={(e) => setPhysicalStock(e.target.value)}
              required
              step="any"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="physicalSales"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Physical Sales:
            </label>
            <input
              type="number"
              id="physicalSales"
              value={physicalSales}
              onChange={(e) => setPhysicalSales(e.target.value)}
              required
              step="any"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              Add Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VarianceReportPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [varianceReports, setVarianceReports] = useState([]);
  const [nextId, setNextId] = useState(1);

  const handleAddVariance = (newReport) => {
    const systemStock = newReport.physicalStock * 0.95;
    const stockDifference = newReport.physicalStock - systemStock;

    const systemSales = newReport.physicalSales * 1.05;
    const salesDifference = newReport.physicalSales - systemSales;

    const reportWithCalculations = {
      id: nextId,
      userId: "admin",
      ...newReport,
      systemStock: systemStock.toFixed(2),
      stockDifference: stockDifference.toFixed(2),
      systemSales: systemSales.toFixed(2),
      salesDifference: salesDifference.toFixed(2),
    };

    setVarianceReports((prevReports) => [
      ...prevReports,
      reportWithCalculations,
    ]);
    setNextId((prevId) => prevId + 1);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Warehouse Variance Reports
          </h1>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Add New Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border-gray-100 overflow-x-auto">
        {varianceReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-4">
            <svg
              className="text-gray-400 text-6xl mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "4rem", height: "4rem" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 2v-6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              No variance reports found
            </h3>
            <p className="text-gray-500 mt-1">
              Click "Add New Report" to create your first report.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Store ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Start Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  End Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Physical Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  System Stock
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Stock Difference
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Physical Sales
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  System Sales
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Sales Difference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {varianceReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.storeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.physicalStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.systemStock}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      parseFloat(report.stockDifference) !== 0
                        ? "bg-yellow-100 text-yellow-800 font-semibold rounded-full px-2 inline-flex text-xs leading-5"
                        : "text-gray-500"
                    }`}
                  >
                    {report.stockDifference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.physicalSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.systemSales}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      parseFloat(report.salesDifference) !== 0
                        ? "bg-red-100 text-red-800 font-semibold rounded-full px-2 inline-flex text-xs leading-5"
                        : "text-gray-500"
                    }`}
                  >
                    {report.salesDifference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <AddVarianceModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddVariance}
        />
      )}
    </div>
  );
};

export default VarianceReportPage;
