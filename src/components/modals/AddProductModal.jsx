import React, { useState, useEffect } from "react";
import { FaImage, FaUpload } from "react-icons/fa";
import { addProducts} from "../../api/products";
import { getCategories } from "../../api/category";
import { toast } from "react-toastify";
import { getUser } from "../../api/auth";

function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    barcode: "",
    sku: "",
    category_id: "",
    image: null,
  });

  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then((data) => {
          setCategories(data.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          toast.error("Failed to fetch categories.");
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image" && !formData.image) {
        return;
      }
      data.append(key, formData[key]);
    });

    try {
      const newProduct = await addProducts(data);
      onAddProduct(newProduct);
      onClose();
      
    } catch (error) {
      console.error("Error adding product:", error);
      if (error?.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        toast.error(`Failed to add product: ${errorMessages}`);
      } else if (error?.message) {
        toast.error(`Failed to add product: ${error.message}`);
      } else {
        toast.error("Failed to add product. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={255}
                required
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={255}
                required
                rows={3}
                onChange={handleChange}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
                min="0"
                max="999999999"
                required
                onChange={handleChange}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                onChange={handleChange}
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <input
                type="text"
                name="barcode"
                placeholder="Enter barcode"
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                onChange={handleChange}
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                placeholder="Enter SKU"
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                onChange={handleChange}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Optional)</label>
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
                  onChange={handleChange}
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
            <p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG, JFIF, or WEBP, max 8MB (Optional)</p>
          </div>

          {/* Buttons */}
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
