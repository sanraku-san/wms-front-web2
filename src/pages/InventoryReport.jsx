import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { getReports } from "../api/variance";
import AddVarianceModal from "../components/modals/createReport";
import { ToastContainer,toast } from "react-toastify";

const VarianceReportPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [varianceReports, setVarianceReports] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getReports()
      .then((res) => {
        console.log("Fetched Variance Reports:", res);

        const transformedReports = res.data.data.map((report) => {
          const physicalStock = report.physical_stock || 0;
          const physicalSales = report.physical_sales || 0;

          const systemStock = physicalStock * 0.95;
          const stockDifference = physicalStock - systemStock;

          const systemSales = physicalSales * 1.05;
          const salesDifference = physicalSales - systemSales;

          return {
            id: report.id,
            userId: report.user_id,
            storeId: report.store?.name,
            startDate: report.start_date,
            endDate: report.end_date,
            physicalStock: report.physical_stock,
            systemStock: systemStock.toFixed(2),
            stockDifference: stockDifference.toFixed(2),
            physicalSales: report.physical_sales,
            systemSales: systemSales.toFixed(2),
            salesDifference: salesDifference.toFixed(2),
          };
        });

        setVarianceReports(transformedReports);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching variance reports:", error);
        setLoading(false);
      });
  }, []);

  const handleAddVariance = (newReport) => {
    const systemStock = newReport.physicalStock * 0.95;
    const stockDifference = newReport.physicalStock - systemStock;

    const systemSales = newReport.physicalSales * 1.05;
    const salesDifference = newReport.physicalSales - systemSales;

    const reportWithCalculations = {
      id: newReport.id || nextId,
      userId: newReport.user_id || "admin",
      storeId: newReport.store_id || newReport.storeId,
      startDate: newReport.start_date || newReport.startDate,
      endDate: newReport.end_date || newReport.endDate,
      physicalStock: parseFloat(newReport.physicalStock).toFixed(2),
      systemStock: systemStock.toFixed(2),
      stockDifference: stockDifference.toFixed(2),
      physicalSales: parseFloat(newReport.physicalSales).toFixed(2),
      systemSales: systemSales.toFixed(2),
      salesDifference: salesDifference.toFixed(2),
    };

    setVarianceReports((prevReports) => [
      ...prevReports,
      reportWithCalculations,
    ]);
    if (!newReport.id) {
      setNextId((prevId) => prevId + 1);
    }
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : varianceReports.length === 0 ? (
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
                {[
                  "ID",
                  "Store",
                  "Start Date",
                  "End Date",
                  "Physical Stock",
                  "System Stock",
                  "Stock Difference",
                  "Physical Sales",
                  "System Sales",
                  "Sales Difference",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {varianceReports.map((report) => (
                <tr key={report.id}>
                  {[
                    "id",
                    "storeId",
                    "startDate",
                    "endDate",
                    "physicalStock",
                    "systemStock",
                    "stockDifference",
                    "physicalSales",
                    "systemSales",
                    "salesDifference",
                  ].map((field) => (
                    <td
                      key={field}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        ["stockDifference", "salesDifference"].includes(
                          field
                        ) && parseFloat(report[field]) !== 0
                          ? field === "stockDifference"
                            ? "bg-yellow-100 text-yellow-800 font-semibold rounded-full px-2 inline-flex text-xs leading-5"
                            : "bg-red-100 text-red-800 font-semibold rounded-full px-2 inline-flex text-xs leading-5"
                          : "text-gray-500"
                      }`}
                    >
                      {report[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        )}
      </div>
      <ToastContainer />

      {isModalOpen && (
        <AddVarianceModal
          isOpen={() => setIsModalOpen(true)}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddVariance}
        />
      )}
    </div>
  );
};

export default VarianceReportPage;
