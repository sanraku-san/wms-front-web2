import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaImage,
} from "react-icons/fa";
import withAuth from "../hoc/withAuth";
import { getProducts, deleteProduct, editProduct } from "../api/products";
import { getUser } from "../api/auth";
import AddProductModal from "../components/modals/AddProductModal";
import EditProductModal from "../components/modals/EditProductModal";
import { toast, ToastContainer } from "react-toastify";

function Inventory() {
  const [sortDirection, setSortDirection] = useState("asc");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); 

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const authToken = sessionStorage.getItem("authToken");

      if (authToken) {
        try {
          const userData = await getUser(authToken)
          if (userData && userData.data && userData.data.roles && userData.data.roles.length > 0) {
            setCurrentUserRole(userData.data.roles[0].name);
          } else {
            console.warn("User data received but no role found in userData.data.roles[0].name. Defaulting to 'viewer'.", userData);
            setCurrentUserRole('viewer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Failed to load user permissions.");
          setCurrentUserRole('viewer');
        }
      } else {
        setCurrentUserRole('viewer');
      }

      getProducts()
        .then((res) => {
          setProducts(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          toast.error("Failed to fetch products.");
          setLoading(false);
        });
    };

    fetchInitialData();
  }, []);

  const handleAddProductSuccess = (newProduct) => {
    toast.success("Product added successfully!");
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productId)
        );
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleShowImage = (imagePath) => {
    if (imagePath) {
      alert("Image URL: " + imagePath);
    } else {
      alert("No image available for this product.");
    }
  };

  const handleSaveEdit = async (formData, productId) => {
    try {
      const updatedProductResponse = await editProduct(productId, formData);
      const updatedProduct = updatedProductResponse.data;
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === productId ? updatedProduct : p))
      );
      toast.success("Product updated successfully!");
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  const isViewer = currentUserRole === 'viewer';

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FaFilter /> Filters
            </button>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              Sort
            </button>
            {/* Hide Add New Product button if user is viewer */}
            {!isViewer && (
              <button
                onClick={() => setIsAddModalOpen(true)} // Open add product modal
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FaPlus /> Add New Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Defects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              {/* Conditionally render Actions header */}
              {!isViewer && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center h-64">
                    <FaSearch className="text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="text-gray-500 mt-1">Click "Add New Product" to create your first product.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.flawed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock === 0
                        ? "bg-red-100 text-red-800"
                        : product.stock <= 20
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {product.stock === 0 ? "Out of Stock" : product.stock <= 50 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  {/* Conditionally render action buttons */}
                  {!isViewer && ( // Only show if NOT a viewer
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)} // Open edit modal
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete product"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProductSuccess}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={editingProduct}
      />

      <Outlet />
    </div>
  );
}

export default withAuth(Inventory);