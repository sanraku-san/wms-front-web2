import React from "react";
import { FaImage, FaEdit, FaTrash } from "react-icons/fa";
import Barcode from "react-barcode";

const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  formatCurrency,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !product) return null;
  console.log("image url", product.image);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-full">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-medium text-gray-900">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <FaImage className="text-gray-400 text-6xl" />
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {formatCurrency(product.price)}
            </p>
            <p>{product.stock} units in stock</p>
            <p>{product.description}</p>

            <p className="font-bold">{product.category?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-35 mt-2">
          <div className="flex justify-center ml-17">
            <Barcode value={product.barcode} className="h-30" />
          </div>
          <div className="flex justify-end gap-3 mt-20 ">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
            >
              <FaEdit /> Edit Product
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <FaTrash /> Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
