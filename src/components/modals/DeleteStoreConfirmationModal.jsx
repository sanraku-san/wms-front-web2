// src/components/DeleteConfirmationModal.js
import React from 'react';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 h-full overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Confirm Deletion
                </h3>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete {itemName ? `"${itemName}"` : "this item"}?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;