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
import { getUsers } from "../api/accounts";
import AccountModal from "../components/modals/AccountModal";
import DeleteStoreConfirmationModal from "../components/modals/DeleteStoreConfirmationModal";
import { ToastContainer, toast } from "react-toastify";

function AdminPanel() {
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAccount, setCurrentAccount] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDeleteId, setAccountToDeleteId] = useState(null);
  const [accountToDeleteName, setAccountToDeleteName] = useState("");

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

  // Pagination
  const indexOfLastAccount = currentPage * itemsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - itemsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(accounts.length / itemsPerPage);

  // Modal handlers
  const handleAddAccount = () => {
    setCurrentAccount({ id: null, name: "", email: "", role: "" });
    setIsEdit(false);
    setShowAccountModal(true);
  };

  const handleEditAccount = (account) => {
    setCurrentAccount({
      id: account.id,
      name: `${account.profile?.first_name || ""} ${account.profile?.last_name || ""}`.trim(),
      email: account.email,
      role: account.roles?.[0]?.name || "",
    });
    setIsEdit(true);
    setShowAccountModal(true);
  };

  const handleCloseAccountModal = () => {
    setShowAccountModal(false);
    setCurrentAccount({ id: null, name: "", email: "", role: "" });
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!currentAccount.name || !currentAccount.email || !currentAccount.role) {
      toast.error("All fields are required.");
      return;
    }
    if (isEdit) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === currentAccount.id
            ? {
                ...acc,
                email: currentAccount.email,
                roles: [{ name: currentAccount.role }],
                profile: {
                  ...acc.profile,
                  first_name: currentAccount.name.split(" ")[0] || "",
                  last_name: currentAccount.name.split(" ").slice(1).join(" ") || "",
                },
              }
            : acc
        )
      );
      toast.info("Account updated successfully!");
    } else {
      setAccounts((prev) => [
        ...prev,
        {
          id: Date.now(),
          email: currentAccount.email,
          roles: [{ name: currentAccount.role }],
          profile: {
            first_name: currentAccount.name.split(" ")[0] || "",
            last_name: currentAccount.name.split(" ").slice(1).join(" ") || "",
          },
        },
      ]);
      toast.success("Account added successfully!");
    }
    setShowAccountModal(false);
    setCurrentAccount({ id: null, name: "", email: "", role: "" });
  };

  // Delete handlers
  const handleDeleteAccount = (account) => {
    setAccountToDeleteId(account.id);
    setAccountToDeleteName(
      `${account.profile?.first_name || ""} ${account.profile?.last_name || ""}`.trim()
    );
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAccountToDeleteId(null);
    setAccountToDeleteName("");
  };

  const handleConfirmDelete = () => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDeleteId));
    toast.info("Account deleted successfully!");
    setShowDeleteModal(false);
    setAccountToDeleteId(null);
    setAccountToDeleteName("");
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              currentAccounts
                .filter(
                  (account) =>
                    `${account.profile?.first_name || ""} ${account.profile?.last_name || ""}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (account.email || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => {
                  const nameA = `${a.profile?.first_name || ""} ${a.profile?.last_name || ""}`.toLowerCase();
                  const nameB = `${b.profile?.first_name || ""} ${b.profile?.last_name || ""}`.toLowerCase();
                  if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
                  if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
                  return 0;
                })
                .map((account) => (
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
                          account.roles?.[0]?.name === "admin"
                            ? "bg-red-100 text-red-800"
                            : account.roles?.[0]?.name === "moderator"
                            ? "bg-yellow-100 text-yellow-800"
                            : account.roles?.[0]?.name === "user"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {account.roles?.[0]?.name}
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
        {totalPages > 1 && (
          <div className="flex justify-center items-center py-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <AccountModal
        isOpen={showAccountModal}
        onClose={handleCloseAccountModal}
        onSave={handleSaveAccount}
        currentAccount={currentAccount}
        isEdit={isEdit}
        setCurrentAccount={setCurrentAccount}
        roles={["admin", "moderator", "user"]}
      />

      <DeleteStoreConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={accountToDeleteName}
      />

      <ToastContainer />
      <Outlet />
    </div>
  );
}

export default withAuth(AdminPanel);