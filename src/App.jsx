import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { FaSearch, FaBell, FaQuestion, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUser } from "./api/auth";
export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,setError] =useState(null);
  const getPageTitle = () => {
    const path = location.pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const userData = await getUser(token);
      setUser(userData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="flex flex-row">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
             
              <div className="flex items-center border-l border-gray-200 pl-4 ml-2">
                <div className="flex flex-col mr-3 text-right hidden sm:block">
                  <span className="text-sm font-medium text-gray-700">
                    {loading ? "Loading..." : user ? user.username : ""}
                  </span>
                </div>
                <div
                  className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center hover:bg-indigo-400 text-white shadow-md"
                  onClick={() => navigate("/profile")}
                >
                  <FaUserCircle className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
