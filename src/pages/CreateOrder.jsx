import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStores } from "../api/stores";
import { getProducts } from "../api/products";
import { addProductOrder } from "../api/order";
import { toast, ToastContainer } from "react-toastify";
import { Trash2, ShoppingCart, Loader2, Search } from "lucide-react";
import withAuth from "../hoc/withAuth";

function CreateOrder() {
  const [transaction, setTransaction] = useState({
    store_id: "",
    transaction_type_id: "2",
    total_transaction_price: 0,
    products: [],
  });
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [orderProducts, setOrderProducts] = useState([]);
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
  
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storesData = await getStores(authToken);
        const productsData = await getProducts(authToken);
  
        console.log("Products Data:", productsData.data);
        console.log("Stores Data:", storesData.data);
  
        setStores(Array.isArray(storesData.data) ? storesData.data : []);
        setProducts(Array.isArray(productsData.data.data) ? productsData.data.data : []);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [authToken, navigate]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setDropdownOpen(value.length > 0);
  };

  const handleProductSelect = (productId) => {
    setTransaction((prev) => ({
      ...prev,
      products: [...prev.products, { product_id: productId, quantity: 1 }],
    }));
    setSearchTerm("");
    setDropdownOpen(false);
  };

  const handleQuantityChange = (index, quantity) => {
    setTransaction((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: parseInt(quantity, 10) || 1,
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const handleRemoveProduct = (index) => {
    setTransaction((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleOrderQuantityChange = (index, quantity) => {
    setOrderProducts((prev) => {
      const updatedProducts = [...prev];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: parseInt(quantity, 10) || 1,
      };
      return updatedProducts;
    });
  };

  const handleRemoveOrderProduct = (index) => {
    setOrderProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const filterProducts = (term) => {
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.barcode.toLowerCase().includes(term.toLowerCase())
    );
  };

  useEffect(() => {
    let total = 0;
    transaction.products.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setTransaction((prev) => ({ ...prev, total_transaction_price: total }));
  }, [transaction.products, products]);

  const mergeProductsToOrder = (newProducts) => {
    setOrderProducts((prevOrderProducts) => {
      const updatedOrder = [...prevOrderProducts];

      newProducts.forEach((newProduct) => {
        const existingIndex = updatedOrder.findIndex(
          (orderProduct) => orderProduct.product_id === newProduct.product_id
        );

        if (existingIndex !== -1) {
          updatedOrder[existingIndex] = {
            ...updatedOrder[existingIndex],
            quantity:
              updatedOrder[existingIndex].quantity + newProduct.quantity,
          };
        } else {
          updatedOrder.push({ ...newProduct });
        }
      });

      return updatedOrder;
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!authToken) return;

    setError(null);

    if (transaction.products.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    try {
      mergeProductsToOrder(transaction.products);

      toast.success("Products added to order!");

      setTransaction((prev) => ({
        ...prev,
        products: [],
        total_transaction_price: 0,
      }));
      setSearchTerm("");
      setDropdownOpen(false);
    } catch (err) {
      setError(err.message || "An error occurred while adding products.");
      toast.error("Failed to add products!");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!authToken) return;
  
    setLoading(true);
    setError(null);
  
    if (!transaction.store_id) {
      setError("Please select a store.");
      setLoading(false);
      return;
    }
    if (!transaction.transaction_type_id) {
      setError("Please select a transaction type.");
      setLoading(false);
      return;
    }
    if (orderProducts.length === 0) {
      setError("Please add at least one product to the order.");
      setLoading(false);
      return;
    }
  
    try {
      const orderData = {
        store_id: transaction.store_id,
        transaction_type_id: transaction.transaction_type_id,
        products: orderProducts, 
        note: transaction.note || null,
      };
  
      console.log("Sending order data:", orderData);
  
      const responseData = await addProductOrder(orderData, authToken);
      console.log("Product order created:", responseData);
      toast.success("Product order created successfully!");
  
      setTransaction({
        store_id: "",
        transaction_type_id: "2",
        total_transaction_price: 0,
        products: [],
      });
      setOrderProducts([]);
      setSearchTerm("");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error creating product order:", err);
      setError(
        err.message || "An error occurred while creating the product order."
      );
      toast.error("Product order creation failed!");
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };
  
  const calculateOrderTotal = () => {
    let total = 0;
    orderProducts.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    return total;
  };

  return (
    <div className="h-[85vh] overflow-hidden flex flex-col">
      <div className="flex-1 p-4 sm:p-1 flex flex-col md:flex-row gap-6 min-h-0">

        <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col min-h-0  overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Request Products</h2>
          </div>

          <div className="flex-1 p-4 sm:p-6">
            <form
              onSubmit={handleAddProduct}
              className="space-y-6 h-full flex flex-col"
            >
              
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search product by name or barcode"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filterProducts(searchTerm).length > 0 ? (
                      filterProducts(searchTerm).map((product) => (
                        <div
                          key={product.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleProductSelect(product.id)}
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Barcode: {product.barcode}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {transaction.products.length > 0 ? (
                  <div className="space-y-3 h-full">
                    {transaction.products.map((item, index) => {
                      const product = products.find(
                        (p) => p.id === item.product_id
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-slide-down"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {product?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              SKU: {product?.barcode || "N/A"}
                            </p>
                          </div>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-center"
                            min="1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No products selected yet.</p>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 space-y-4 border-t border-gray-200 pt-4">
                {transaction.products.length > 0 && (
                  <p className="font-semibold text-gray-800">
                    Total: {formatCurrency(transaction.total_transaction_price)}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Add To Order Request"
                  )}
                </button> 
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </form>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col min-h-0  overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Order Request Form</h2>
          </div>

          <div className="flex-1 p-4 sm:p-6 ">
            <form
              onSubmit={handlePlaceOrder}
              className="space-y-6 h-full flex flex-col"
            >
              
              <div className="flex-shrink-0 space-y-6">
                {/* Store */}
                <div className="space-y-2">
                  <label
                    htmlFor="store_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Store Name
                  </label>
                  <select
                    id="store_id"
                    name="store_id"
                    value={transaction.store_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transaction Type */}
                <div className="space-y-2">
                  <label
                    htmlFor="transaction_type_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Transaction Type
                  </label>
                  <select
                    id="transaction_type_id"
                    name="transaction_type_id"
                    value={transaction.transaction_type_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="1">Inbound</option>
                    <option value="2">Outbound</option>
                  </select>
                </div>

                <h3 className="text-md font-semibold text-gray-800">
                  Product List
                </h3>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {orderProducts.length > 0 ? (
                  <div className="space-y-3 h-full">
                    {orderProducts.map((item, index) => {
                      const product = products.find(
                        (p) => p.id === item.product_id
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-slide-down"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {product?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              SKU: {product?.barcode || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              x{item.quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOrderProduct(index)}
                            className="text-red-600 hover:text-red-800 focus:outline-none"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No products added to order yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 space-y-4 border-t border-gray-200 pt-4">
                {orderProducts.length > 0 && (
                  <p className="font-semibold text-gray-800">
                    Total: {formatCurrency(calculateOrderTotal())}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default withAuth(CreateOrder);
