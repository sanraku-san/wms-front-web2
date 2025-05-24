import { XCircle } from "lucide-react";

export const TransactionDetailsModal = ({ transaction, onClose, onDelete }) => {
  if (!transaction) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP", 
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Transaction Information */}
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date:</p>
              <p className="font-semibold text-gray-800">{transaction.created_at}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Store:</p>
              <p className="font-semibold text-gray-800">
                {transaction.store?.name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type:</p>
              <p className={`font-semibold capitalize ${transaction.transaction_type_id === 1 ? 'text-green-700' : 'text-red-600'}`}>
                {transaction.transaction_type_id === 1 ? "Inbound" : "Outbound"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount:</p>
              <p className="text-lg font-bold text-indigo-600">
                {formatCurrency(transaction.total_transaction_price)}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div>
            <p className="text-sm font-medium text-gray-500">Products:</p>
            {transaction.products && transaction.products.length > 0 ? (
              <div className="border border-gray-300 rounded-lg p-3 mt-2 overflow-y-auto max-h-48">
                {" "}
                {/*  Scrollable */}
                {transaction.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-2 border-b last:border-none"
                  >
                    <img
                      className="w-16 h-16 object-cover rounded-md border border-gray-300"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {product.pivot?.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price per unit: {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No products associated with this transaction.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
