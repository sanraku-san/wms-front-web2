import React from "react";
import { FaImage } from "react-icons/fa";

function AccountDetailsModal({ isOpen, onClose, account }) {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.profile?.first_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.profile?.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.profile?.contact_number}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">{account.roles[0]?.name}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 flex justify-center">
              <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {account.profile?.image ? (
                  <img src={account.profile?.image} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <FaImage className="text-gray-400 text-4xl" />
                )}
              </div>
            </div>
          
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailsModal;