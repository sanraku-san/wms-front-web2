import React, { useState, useRef } from "react";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

function AddAccountModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
    first_name: "",
    last_name: "",
    contact_number: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpg", "image/jpeg", "image/png", "image/jfif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Invalid file type. Use JPG, JPEG, PNG, JFIF, or WEBP." }));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "File size exceeds 8MB." }));
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = "";
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    else if (!/^[a-zA-Z0-9_-]{4,32}$/.test(formData.username)) newErrors.username = "4-32 characters, letters, numbers, underscores, or hyphens";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.length < 8 || formData.email.length > 64) newErrors.email = "Invalid email format (8-64 characters)";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.role_id) newErrors.role_id = "Role is required";
    if (!formData.first_name) newErrors.first_name = "First name is required";
    else if (!/^[a-zA-Z]{2,32}$/.test(formData.first_name)) newErrors.first_name = "2-32 characters, letters only";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    else if (!/^[a-zA-Z]{2,32}$/.test(formData.last_name)) newErrors.last_name = "2-32 characters, letters only";
    if (!formData.contact_number) newErrors.contact_number = "Contact number is required";
    else if (!/^(09|\+63)\d{9}$/.test(formData.contact_number)) newErrors.contact_number = "Must start with 09 or +63 followed by 9 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role_id", formData.role_id);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("contact_number", formData.contact_number);
    if (image) data.append("image", image);

    try {
      await onSave(data);
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        role_id: "",
        first_name: "",
        last_name: "",
        contact_number: "",
      });
      setImage(null);
      setImagePreview(null);
      fileInputRef.current.value = "";
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to add account");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              {!errors.username && (
                <p className="text-xs text-gray-500 mt-1">4-32 characters, letters, numbers, underscores, or hyphens</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              {!errors.email && <p className="text-xs text-gray-500 mt-1">8-64 characters, valid email format</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              {!errors.password && <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a role</option>
                <option value="1">Admin</option>
                <option value="2">Moderator</option>
                <option value="3">User</option>
                <option value="4">Viewer</option>
              </select>
              {errors.role_id && <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
              {!errors.first_name && <p className="text-xs text-gray-500 mt-1">2-32 characters, letters only</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
              {!errors.last_name && <p className="text-xs text-gray-500 mt-1">2-32 characters, letters only</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contact_number"
                placeholder="Enter contact number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.contact_number && <p className="text-xs text-red-500 mt-1">{errors.contact_number}</p>}
              {!errors.contact_number && <p className="text-xs text-gray-500 mt-1">09 / +63 followed by 9 digits</p>}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 flex justify-center">
                <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <FaImage className="text-gray-400 text-4xl" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <input
                  type="file"
                  name="image"
                  accept="image/jpg,image/jpeg,image/png,image/jfif,image/webp"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2 mb-2"
                >
                  <FaUpload /> Choose Image File
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                  >
                    <FaTrash /> Remove Image
                  </button>
                )}
              </div>
            </div>
            {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
            {!errors.image && <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG, JFIF, or WEBP, max 8MB</p>}
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