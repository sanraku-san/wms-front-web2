import React from 'react';

const DeleteProductModal = ({ isOpen, onClose, onConfirm, product }) => {
  if (!isOpen || !product) return null;



  return (
    <div className="fixed inset-0 h-fulblack bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p className="text-gray-500 mb-4">Are you sure you want to delete <span className="font-medium">{product.name}</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onConfirm(product.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;