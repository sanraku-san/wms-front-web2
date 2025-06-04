
import React, { useState, useEffect, useRef } from "react";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";

function EditProductModal({ isOpen, onClose, onSave, product }) {
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
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        barcode: product.barcode || "",
        sku: product.sku || "",
        category_id: product.category_id || "",
        image: null,
      });
      setImagePreview(product.image ? `${product.image}` : null);
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "REMOVE_IMAGE_FLAG" })); 
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("_method", "PATCH");
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("barcode", formData.barcode);
    data.append("sku", formData.sku);
    data.append("category_id", formData.category_id);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    } else if (formData.image === "REMOVE_IMAGE_FLAG") {
      data.append("image", "");
    }
  onSave(data, product.id);
  onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={255}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={255}
                required
                rows={3}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                step="0.01"
                min="0"
                max="999999999"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Enter barcode"
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                placeholder="Enter category ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Image upload and preview */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 flex justify-center">
                <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaImage className="text-gray-400 text-4xl" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  name="image"
                  accept="image/jpg,image/jpeg,image/png,image/jfif,image/webp"
                  className="hidden"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2 mb-2"
                >
                  <FaUpload /> Choose Image File
                </button>
                {(imagePreview || product?.image) && ( // Show remove button if there's a preview or an existing product image
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 mt-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                  >
                    <FaTrash /> Remove Image
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              JPG, JPEG, PNG, JFIF, or WEBP, max 8MB
            </p>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;