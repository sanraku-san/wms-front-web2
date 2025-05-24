import React from 'react';
import { FaImage, FaUpload, FaTrash } from 'react-icons/fa';
import { useProductForm } from './useProductForm';

function EditProductModal({ isOpen, onClose, onSave, currentProduct, categories = [] }) {
  const {
    product,
    setProduct,
    localCategories,
    imagePreview,
    imageRemoved,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
  } = useProductForm(isOpen, currentProduct, categories);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('barcode', product.barcode);
    formData.append('category_id', product.category_id);
    formData.append('price', parseFloat(product.price) || 0);
    formData.append('stock', String(product.stock));
    formData.append('description', product.description);

    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append('image', file);
    } else if (imageRemoved) {
      formData.append('image', '');
    }

    formData.append('_method', 'PUT');
    console.log('FormData before save:', Object.fromEntries(formData.entries()));
    onSave(formData, product.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={product.barcode}
                onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={product.category_id || ''}
                onChange={(e) => setProduct({ ...product, category_id: parseInt(e.target.value) || '' })}
              >
                <option value="">Select a category</option>
                {localCategories.length > 0 ? (
                  localCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="text"
                required
                pattern="^\d*\.?\d{0,2}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={product.price}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('Price input:', value);
                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                    setProduct({ ...product, price: value });
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                value={product.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('Stock input:', value);
                  setProduct({ ...product, stock: value === '' ? '' : parseInt(value) || 0 });
                }}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 flex justify-center">
                <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                  ) : (
                    <FaImage className="text-gray-400 text-4xl" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center">
                <input
                  type="file"
                  accept="image/*"
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
                    className="px-4 py-2 mt-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                  >
                    <FaTrash /> Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            ></textarea>
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
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;