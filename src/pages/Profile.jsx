import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../api/auth";
import { FaUser } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const removeAuthToken = () => {
    sessionStorage.removeItem("authToken");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      removeAuthToken();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Error: Unable to load profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 border-b border-gray-100 bg-indigo-50">
          <h1 className="text-3xl font-extrabold text-indigo-800 tracking-tight mb-4 md:mb-0">
            User Profile
          </h1>

          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative p-1 bg-white rounded-full shadow-lg border-2 border-indigo-500">
              {user.profile?.image ? (
                <img
                  src={user.profile?.image || defaultProfileImage}
                  alt="Profile"
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <FaUser className="text-6xl sm:text-7xl" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">
              Personal Information
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-indigo-600">Name:</span>{' '}
                {user.profile?.first_name} {user.profile?.last_name}
              </p>
              <p>
                <span className="font-semibold text-indigo-600">Username:</span>{' '}
                {user.username}
              </p>
              <p>
                <span className="font-semibold text-indigo-600">Email:</span>{' '}
                {user.email}
              </p>
              {user.profile?.address && ( 
                <p>
                  <span className="font-semibold text-indigo-600">Location:</span>{' '}
                  {user.profile.address}
                </p>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-4 pb-2 border-b border-indigo-200">
              Account Settings
            </h2>
            <div className="space-y-3 text-gray-700">
              {user.roles && user.roles.length > 0 && (
                <p>
                  <span className="font-semibold text-indigo-600">Role:</span>{' '}
                  {user.roles[0]?.name}
                </p>
              )}
              {user.profile?.contact_number && (
                <p>
                  <span className="font-semibold text-indigo-600">Contact:</span>{' '}
                  {user.profile.contact_number}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end"> 
              <button
                onClick={handleLogout}
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}