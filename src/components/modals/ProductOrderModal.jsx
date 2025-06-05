import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { checkoutOrder } from "../../api/order";

const ProductOrderModal = ({
  isOpen,
  onClose,
  selectedOrder,
  modalLoading,
  formatCurrency,
  getOrderTotal,
  onEdit,
  onApprovalSuccess,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  if (!isOpen) return null;

  const handleApproveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedOrder) return;

    setIsApproving(true);
    try {
      const checkoutData = {
        order_id: selectedOrder.id, 
        store_id: selectedOrder.store_id || selectedOrder.store?.id,
        transaction_type_id: selectedOrder.transaction_type_id,
        products:
          selectedOrder.products?.map((product) => ({
            product_id: product.id,
            quantity: product.pivot?.quantity || 0,
            flawed_quantity: product.pivot?.flawed_quantity || 0,
          })) || [],
        total_transaction_price: getOrderTotal(selectedOrder),
        note: selectedOrder.notes || selectedOrder.note || "",
      };

      console.log("Transaction Data:", checkoutData);
      
      const response = await checkoutOrder(checkoutData);

      if (response.success) {
        setShowConfirmModal(false);
        onClose();
        if (onApprovalSuccess) {
          onApprovalSuccess(response.data);
        }
        alert("Transaction approved and created successfully!");
      }
    } catch (error) {
      console.error("Failed to approve transaction:", error);
      alert(`Failed to approve transaction: ${error.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelApproval = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          <div className="mt-3">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Order Details {selectedOrder ? `- #${selectedOrder.id}` : ""}
              </h3>
              <button
                onClick={onClose}
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
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedOrder.created_at || selectedOrder.updated_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedOrder.updated_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        {formatCurrency(selectedOrder.total_transaction_price)}
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

                {/* Products List */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">
                    Products ({selectedOrder.products?.length || 0} items)
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {selectedOrder.products &&
                    selectedOrder.products.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOrder.products.map((product, index) => (
                          <div
                            key={product.id || index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div>
                                <h5 className="font-medium text-gray-900">
                                  {product.name || "Product Name"}
                                </h5>
                                <div className="text-sm text-indigo-600">{product.stock} in stock</div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  SKU: {product.sku || "N/A"}
                                </p>
                                {product.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {product.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-sm text-gray-600">
                                    Qty:{" "}
                                    {Math.floor(product.pivot?.quantity || 0)}
                                  </span>
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
                                  (parseFloat(product.pivot?.quantity) || 0) *
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
              <button
                onClick={handleApproveClick}
                disabled={!selectedOrder || modalLoading}
                className="flex-1 sm:flex-none px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out order-1 sm:order-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve
              </button>
              <div className="flex gap-3 order-2 sm:order-none sm:ml-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-150 ease-in-out"
                >
                  Close
                </button>
                {selectedOrder && onEdit && (
                  <button
                    onClick={() => onEdit(selectedOrder)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Edit Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-[60]">
          <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Confirmation Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Approval
                </h3>
                <button
                  onClick={handleCancelApproval}
                  disabled={isApproving}
                  className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Confirmation Content */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to approve this transaction?
                </p>
              </div>

              {/* Confirmation Footer */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelApproval}
                  disabled={isApproving}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={isApproving}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out disabled:opacity-50 flex items-center"
                >
                  {isApproving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Approving...
                    </>
                  ) : (
                    "Yes, Approve"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductOrderModal;