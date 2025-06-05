import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { editProductOrder } from "../../api/order";

const ProductOrderEditModal = ({
  isOpen,
  onClose,
  selectedOrder,
  modalLoading,
  formatCurrency,
  getOrderTotal,
  onSave: onParentSave, 
}) => {
  const [editedProducts, setEditedProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedOrder && selectedOrder.products) {
      setEditedProducts(
        selectedOrder.products.map((product) => ({
          ...product,
          editedQuantity: product.pivot?.quantity || 0,
        }))
      );
    }
  }, [selectedOrder]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(0, parseFloat(newQuantity) || 0);

    setEditedProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, editedQuantity: quantity }
          : product
      )
    );
  };

  const handleSave = async () => {
    if (!selectedOrder) return; 

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("order_id", selectedOrder.id);
      console.log("ID",selectedOrder.id)
      editedProducts.forEach((product, index) => {

        formData.append(`products[${index}][id]`, product.id);
        formData.append(`products[${index}][quantity]`, Math.floor(product.editedQuantity));
      });
      await editProductOrder(selectedOrder.id, formData);
      if (onParentSave) {
        onParentSave();
      }

      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedOrder && selectedOrder.products) {
      setEditedProducts(
        selectedOrder.products.map((product) => ({
          ...product,
          editedQuantity: product.pivot?.quantity || 0,
        }))
      );
    }
    onClose();
  };

  const getEditedOrderTotal = () => {
    return editedProducts.reduce((total, product) => {
      return (
        total +
        Math.floor(product.editedQuantity) *
          (parseFloat(product.pivot?.price) || 0)
      );
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Edit Order {selectedOrder ? `- #${selectedOrder.id}` : ""}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Modal Content */}
          {modalLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-gray-600">
                Loading order details...
              </span>
            </div>
          ) : selectedOrder ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">
                  Order Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store:</span>
                    <span className="font-medium">
                      {selectedOrder.store?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Type:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedOrder.transaction_type_id === 2
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedOrder.transaction_type?.name ||
                        (selectedOrder.transaction_type_id === 2
                          ? "Outbound"
                          : "Inbound")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-indigo-600">
                      {formatCurrency(getEditedOrderTotal())}
                    </span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-600">Notes:</span>
                      <p className="mt-1 text-sm text-gray-800">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">
                  Products ({editedProducts.length || 0} items)
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  {editedProducts && editedProducts.length > 0 ? (
                    <div className="space-y-3">
                      {editedProducts.map((product, index) => (
                        <div
                          key={product.id || index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {product.name || "Product Name"}
                              </h5>
                              <p className="text-sm text-gray-600">
                                SKU: {product.sku || "N/A"}
                              </p>
                              {product.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">
                                    Qty:
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={Math.floor(product.editedQuantity)}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        product.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={isSaving}
                                  />
                                </div>
                                <span className="text-sm font-medium">
                                  {formatCurrency(product.pivot?.price || 0)}{" "}
                                  each
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t flex justify-between">
                            <span className="text-sm text-gray-600">
                              Subtotal:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(
                                Math.floor(product.editedQuantity) *
                                  (parseFloat(product.pivot?.price) || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No products found
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No order data available</p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
            <div className="flex gap-3 sm:ml-auto">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-150 ease-in-out disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedOrder || modalLoading || isSaving}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderEditModal;