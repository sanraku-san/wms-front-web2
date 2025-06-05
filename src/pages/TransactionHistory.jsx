import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaImage,
  FaUpload,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import withAuth from "../hoc/withAuth";
import { getTransactions, getTransactionByID, deleteTransaction } from "../api/transactions";
import TransactionModal from "../components/modals/TransactionModal";
import EditProductOrderModal from "../components/modals/EditProductOrderModal";
import { toast } from "react-toastify";

function ProductOrders() {
  const [sortDirection, setSortDirection] = useState("asc");
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTransactions()
      .then((res) => {
        setTransactionData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transaction:", error);
        toast.error("Failed to fetch transaction.");
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const calculateOrderTotal = (order) => {
    if (!order.products || !Array.isArray(order.products)) {
      return 0;
    }

    return order.products.reduce((total, product) => {
      const quantity = parseFloat(product.pivot.quantity) || 0;
      const price = parseFloat(product.pivot.price) || 0;
      return total + quantity * price;
    }, 0);
  };

  const getOrderTotal = (order) => {
    if (order.total_transaction_price) {
      return parseFloat(order.total_transaction_price);
    }
    return calculateOrderTotal(order);
  };

  const handleRowClick = async (order) => {
    setIsModalOpen(true);
    setModalLoading(true);
    setSelectedOrder(order); 

    try {
      const detailedOrderResponse = await getTransactionByID(order.id);
      setSelectedOrder(
        detailedOrderResponse.data.data || detailedOrderResponse.data
      );
    } catch (error) {
      console.error("Error fetching detailed order:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalLoading(false);
  };

  const handleEditFromModal = (order) => {
    closeModal();
    handleEditOrder(order);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteProductOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this product order?")) {
      try {
        await deleteTransaction(orderId);
        setTransactionData((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        toast.success("Product order deleted successfully!");
      } catch (error) {
        console.error("Error deleting product order:", error);
        toast.error("Failed to delete product order.");
      }
    }
  };

  const handleActionClick = (e, action, order) => {
    e.stopPropagation(); 

    if (action === "edit") {
      handleEditOrder(order);
    } else if (action === "delete") {
      handleDeleteProductOrder(order.id);
    }
  };

  const handleSaveEdit = async (formData, orderId) => {
    try {
      const updatedOrderResponse = await editProductOrder(orderId, formData);
      const updatedOrder = updatedOrderResponse.data;
      setTransactionData((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      toast.success("Product order updated successfully!");
      setIsEditModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating product order:", error);
      toast.error("Failed to update product order.");
    }
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Order Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Store
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Transaction Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Products
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                </td>
              </tr>
            ) : transactionData.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center h-64">
                    <FaSearch className="text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No orders found
                    </h3>
                    <p className="text-gray-500 mt-1">
                      No product orders available.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactionData.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => handleRowClick(order)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.store?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.transaction_type_id === 2
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.transaction_type?.name ||
                        (order.transaction_type_id === 2
                          ? "Outbound"
                          : "Inbound")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.products?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(getOrderTotal(order))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(order.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Order Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedOrder={selectedOrder}
        modalLoading={modalLoading}
        formatCurrency={formatCurrency}
        getOrderTotal={getOrderTotal}
        onEdit={handleEditFromModal}
      />

      {/* Edit Product Order Modal */}
      <EditProductOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        selectedOrder={editingOrder}
        modalLoading={modalLoading}
        formatCurrency={formatCurrency}
        getOrderTotal={getOrderTotal}
      />

      <Outlet />
    </div>
  );
}

export default withAuth(ProductOrders);
