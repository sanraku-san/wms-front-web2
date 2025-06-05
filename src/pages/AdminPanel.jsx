import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import withAuth from "../hoc/withAuth";
import { getUsers, addAccount } from "../api/accounts";

function AdminPanel() {
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setAccounts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Account:", error);
        toast.error("Failed to fetch Account.");
        setLoading(false);
      });
  }, []);

  // const filteredAndSortedAccounts = accounts
  //   .filter(account =>
  //     account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     account.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   .sort((a, b) => {
  //     const nameA = a.name.toLowerCase();
  //     const nameB = b.name.toLowerCase();
  //     if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
  //     if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
  //     return 0;
  //   });

  const handleAddAccount = () => {
    alert("Add New Account clicked!");
  };

  const handleEditAccount = (account) => {
    alert(`Edit Account: ${account.name}`);
  };

  const handleDeleteAccount = (account) => {
    if (
      window.confirm(
        `Are you sure you want to delete account "${account.name}"?`
      )
    ) {
      setAccounts(accounts.filter((acc) => acc.id !== account.id));
      alert(`Account "${account.name}" deleted.`);
    }
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header with Search, Filter, Sort, and Add Button */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search accounts by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FaFilter /> Filters
            </button>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
              Sort
            </button>
            <button
              onClick={handleAddAccount}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <FaPlus /> Add New Account
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-md border-gray-100 overflow-x-auto">
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
                Account Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                </td>
              </tr>
            ) : accounts.length > 0 ? (
              accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.profile?.first_name} {account.profile?.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        account.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : account.role === "moderator"
                          ? "bg-yellow-100 text-yellow-800"
                          : account.role === "user"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {account.roles[0]?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Account"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Account"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 text-sm"
                >
                  No accounts found. Try adjusting your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Outlet />
    </div>
  );
}

export default withAuth(AdminPanel);
