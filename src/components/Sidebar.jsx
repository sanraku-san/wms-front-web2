import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaWarehouse,
  FaBoxes,
  FaUsers,
  FaChartBar,
  FaBars,
  FaTimes,
  FaHistory,
  FaBox,
  FaChartPie,
  FaPlusSquare,
} from "react-icons/fa"; 
import { getUser } from "../api/auth"
// Layout component with sidebar and outlet for nested routes
function AppLayout({ sidebarOpen, toggleSidebar, setIsLoggedIn }) {
  const [user , setUser] = useState(null)
  const [error , setError] = useState(null)
    
  const location = useLocation();
  const [loading, setLoading] = useState(false);
const fetchProfile = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      location("/login");
      return;
    }
    try {
      const userData = await getUser(token);
      setUser(userData.data)
      console.log("User data fetched successfully:", userData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  // Navigation items
      const navItems = [
        { name: 'Dashboard', icon: <FaChartBar />, path: '/dashboard' },
        { name: 'Inventory', icon: <FaBoxes />, path: '/inventory' },
        { name: 'Store', icon: <FaWarehouse />, path: '/store' },
        ...(user && user.roles[0]?.name === "admin"
      ? [{ name: 'Admin Panel', icon: <FaUsers />, path: '/adminpanel' }]
      : []),
      ];

  const transactionItems = [
    { name: "Create Order", icon: <FaPlusSquare />, path: "/createOrder" },
    { name: "Product Orders", icon: <FaBox />, path: "/productOrders" },
    {
      name: "Transaction History",
      icon: <FaHistory />,
      path: "/transactionHistory",
    },
  ];

  const reportItems = [
    {
      name: "Inventory Report",
      icon: <FaChartPie />,
      path: "/reports/inventory",
    },
    {
      name: "Delivery Report",
      icon: <FaChartPie />,
      path: "/reports/delivery",
    },
    { name: "Inbound Report", icon: <FaChartPie />, path: "/reports/inbound" },
  ];

  return (
    <div className="flex">
      {/* Sidebar - Fixed position */}
      <div
        className={`${
          sidebarOpen ? "w-65" : "w-20"
        } bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out fixed h-screen z-30 shadow-xl`}
      >
        {/* Logo and toggle */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700/50">
          <div
            className={`flex items-center ${
              !sidebarOpen && "justify-center w-full"
            }`}
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <FaWarehouse className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-md font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                WMS Pro
              </span>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white bg-slate-700/30 hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Separate toggle button when sidebar is collapsed */}
        {!sidebarOpen && (
          <div className="flex justify-center mt-4">
            <button
              onClick={toggleSidebar}
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
            >
              <FaBars className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-4 px-3 h-screen">
          {sidebarOpen && (
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Main Navigation
            </h2>
          )}
          <nav>
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-1 py-1 rounded-lg transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                                : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                            }`}
                    >
                      <div
                        className={`flex items-center justify-center w-4 h-4 ${
                          isActive ? "text-white" : "text-indigo-400"
                        } group-hover:text-white transition-colors ${
                          !sidebarOpen ? "mx-auto" : ""
                        }`}
                      >
                        {item.icon}
                      </div>
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                      {sidebarOpen && isActive && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {sidebarOpen && (
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-6 mb-3">
                Transactions
              </h2>
            )}
            <ul className="space-y-1.5">
              {transactionItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-1 py-1 rounded-lg transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                                : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                            }`}
                    >
                      <div
                        className={`flex items-center justify-center w-4 h-4 ${
                          isActive ? "text-white" : "text-indigo-400"
                        } group-hover:text-white transition-colors ${
                          !sidebarOpen ? "mx-auto" : ""
                        }`}
                      >
                        {item.icon}
                      </div>
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                      {sidebarOpen && isActive && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {sidebarOpen && (
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-6 mb-3">
                Reports
              </h2>
            )}
            <ul className="space-y-1.5">
              {reportItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-1 py-1 rounded-lg transition-all duration-200 group
                            ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                                : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                            }`}
                    >
                      <div
                        className={`flex items-center justify-center w-4 h-4 ${
                          isActive ? "text-white" : "text-indigo-400"
                        } group-hover:text-white transition-colors ${
                          !sidebarOpen ? "mx-auto" : ""
                        }`}
                      >
                        {item.icon}
                      </div>
                      {sidebarOpen && (
                        <span className="ml-3 font-medium">{item.name}</span>
                      )}
                      {sidebarOpen && isActive && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content - with left margin to accommodate sidebar */}
      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-65" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="bg-gray-900 min-h-screen">
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for development

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppLayout
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}
