import React from "react";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";

function AddAccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Account</h3>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">4-32 characters, letters, numbers, underscores, or hyphens</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">8-64 characters, valid email format</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a role</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">2-32 characters, letters only</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">2-32 characters, letters only</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                placeholder="Enter contact number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">10-12 digits</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 flex justify-center">
                <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  <FaImage className="text-gray-400 text-4xl" />
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <input
                  type="file"
                  name="image"
                  accept="image/jpg,image/jpeg,image/png,image/jfif,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[name="image"]').click()}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2 mb-2"
                >
                  <FaUpload /> Choose Image File
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG, JFIF, or WEBP, max 8MB</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAccountModal;