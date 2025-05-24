import React from "react";
import { FaTimes } from "react-icons/fa";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, account }) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Delete Account</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the account <strong>{account.username}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(account.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;