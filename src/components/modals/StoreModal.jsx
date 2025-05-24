import React from 'react';

const StoreModal = ({
    isOpen,
    onClose,
    onSave,
    currentStore,
    isEdit,
    setCurrentStore
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {isEdit ? "Edit Store" : "Add Store"}
                </h3>
                <form onSubmit={onSave}>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Store Name"
                                value={currentStore.name}
                                onChange={(e) =>
                                    setCurrentStore({ ...currentStore, name: e.target.value })
                                }
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Address"
                                value={currentStore.address}
                                onChange={(e) =>
                                    setCurrentStore({
                                        ...currentStore,
                                        address: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Contact Number"
                                value={currentStore.contact_number}
                                onChange={(e) =>
                                    setCurrentStore({
                                        ...currentStore,
                                        contact_number: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {isEdit ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreModal;
