import React, { useState, useEffect } from 'react';
import { FaBoxes, FaWarehouse, FaTruck, FaChartLine, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getTopFourProducts, getTotalStock, getLowStockProducts, getOutOfStockProducts, getMonthlyReport } from '../api/dashboard';
import { getCategories } from '../api/category';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

Chart.register(...registerables);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryData, setInventoryData] = useState({ labels: [], datasets: [] });
  const [timeRange, setTimeRange] = useState('month');
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getTopFourProducts(),
      getTotalStock(),
      getOutOfStockProducts(),
      getLowStockProducts(),
      getCategories(),
    ])
      .then(([topProductsRes, totalStockRes, outOfStockRes, lowStockRes, categoriesRes]) => {
        setTopProducts(topProductsRes.data);
        setTotalStock(totalStockRes.data);
        setOutOfStock(outOfStockRes.data);
        setLowStock(lowStockRes.data);
        setCategories(categoriesRes.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
        setIsLoading(false);
      });
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: { grid: { display: false } },
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header with Date */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <select 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products Inventory</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{inventoryStats.totalItems}</p>
              <p className="text-xs text-gray-500 mt-1">Value: {formatCurrency(inventoryStats.totalValue)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBoxes className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products Stock</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalStock}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaWarehouse className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Shipments</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
              <p className="text-xs text-gray-500 mt-1">Est. value: {formatCurrency(42500)}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <FaTruck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-indigo-600" />
          Inventory Status Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-lg font-bold text-gray-800">{inventoryStats.totalItems}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
            <p className="text-xs text-gray-500 mb-1">Categories</p>
            <p className="text-lg font-bold text-gray-800">{categories.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
            <p className="text-xs text-gray-500 mb-1">Low Stock</p>
            <p className="text-lg font-bold text-amber-600">{lowStock.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
            <p className="text-xs text-gray-500 mb-1">Out of Stock</p>
            <p className="text-lg font-bold text-red-600">{outOfStock.length}</p>
          </div>
        </div>
        
        <div className="h-64 sm:h-72 rounded-lg border border-gray-100 relative p-4 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <Line data={inventoryData} options={chartOptions} />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Top Products */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaChartBar className="mr-2 text-indigo-600" />
            Top Products Sold
          </h2>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Loading top products...</p>
            ) : !topProducts || topProducts.length === 0 ? (
              <p className="text-gray-500">No top products to display.</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{product.product_name}</span>
                    <span className="text-sm text-gray-500">{product.total_quantity} units</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => navigate('/inventory')}
            className="mt-4 w-full py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
