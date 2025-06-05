import React, { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDollarSign, 
  FaSortAlphaDown, 
  FaSortAlphaUp,
} from "react-icons/fa";
import withAuth from "../hoc/withAuth";
import { getProducts, deleteProduct, editProduct } from "../api/products";
import { getUser } from "../api/auth";
import AddProductModal from "../components/modals/AddProductModal"; 
import EditProductModal from "../components/modals/EditProductModal"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FilterProductsModal({ isOpen, onClose, onApplyFilter, currentFilters }) {
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStartPrice(currentFilters.startPrice !== null ? currentFilters.startPrice : '');
      setEndPrice(currentFilters.endPrice !== null ? currentFilters.endPrice : '');
    }
  }, [isOpen, currentFilters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilter({ 
      startPrice: startPrice !== '' ? parseFloat(startPrice) : null, 
      endPrice: endPrice !== '' ? parseFloat(endPrice) : null 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md overflow-x-auto flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter Products by Price</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Start Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaDollarSign />
              </span>
              <input
                type="number"
                id="startPrice"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 10.00"
                step="0.01"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="endPrice" className="block text-sm font-medium text-gray-700 mb-2">
              End Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <FaDollarSign />
              </span>
              <input
                type="number"
                id="endPrice"
                value={endPrice}
                onChange={(e) => setEndPrice(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 100.00"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SortProductsModal({ isOpen, onClose, onApplySort, currentSort }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (isOpen) {
      setSortBy(currentSort.sortBy || 'name');
      setSortOrder(currentSort.sortOrder || 'asc');
    }
  }, [isOpen, currentSort]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplySort({ sortBy, sortOrder });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sort Products</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="name">Product Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="flawed">Defects</option>
              <option value="category">Category</option>
              <option value="createdAt">Created At</option>
              <option value="updatedAt">Updated At</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="asc"
                  checked={sortOrder === 'asc'}
                  onChange={() => setSortOrder('asc')}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-gray-700 flex items-center">
                  <FaSortAlphaUp className="mr-1" /> Ascending
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="sortOrder"
                  value="desc"
                  checked={sortOrder === 'desc'}
                  onChange={() => setSortOrder('desc')}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 text-gray-700 flex items-center">
                  <FaSortAlphaDown className="mr-1" /> Descending
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Apply Sort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);     
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterCriteria, setFilterCriteria] = useState({ startPrice: null, endPrice: null }); 
  const [sortCriteria, setSortCriteria] = useState({ sortBy: 'name', sortOrder: 'asc' });

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

  const handleApplyFilter = (filters) => {
    setFilterCriteria(filters);
    setCurrentPage(1); 
  };

  const handleApplySort = (sort) => {
    setSortCriteria(sort);
    setCurrentPage(1); 
  };

  const isViewer = currentUserRole === 'viewer';

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterCriteria.startPrice !== null) {
      result = result.filter(product => product.price >= filterCriteria.startPrice);
    }
    if (filterCriteria.endPrice !== null) {
      result = result.filter(product => product.price <= filterCriteria.endPrice);
    }

    result.sort((a, b) => {
      const aValue = a[sortCriteria.sortBy];
      const bValue = b[sortCriteria.sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortCriteria.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        const numA = typeof aValue === 'number' ? aValue : -Infinity;
        const numB = typeof bValue === 'number' ? bValue : -Infinity;
        
        return sortCriteria.sortOrder === 'asc' 
          ? numA - numB 
          : numB - numA;
      }
    });

    return result;
  }, [products, searchTerm, filterCriteria, sortCriteria]);


  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterModalOpen(true)} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FaFilter /> Filters
            </button>
            <button
              onClick={() => setIsSortModalOpen(true)} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {sortCriteria.sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              Sort
            </button>
            {!isViewer && (
              <button
                onClick={() => setIsAddModalOpen(true)} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <FaPlus /> Add New Product
              </button>
            )}
          </div>
        </div>
      </div>

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
            ) : filteredAndSortedProducts.length === 0 ? ( 
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center h-64">
                    <FaSearch className="text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="text-gray-500 mt-1">Adjust your filters or add new products.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
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
                  {!isViewer && ( 
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)} 
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
        {totalPages > 1 && (
          <div className="flex justify-center items-center py-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg border ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ToastContainer />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProductSuccess}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={editingProduct}
      />

      <FilterProductsModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilter={handleApplyFilter}
        currentFilters={filterCriteria}
      />

      <SortProductsModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        onApplySort={handleApplySort}
        currentSort={sortCriteria}
      />

      <Outlet />
    </div>
  );
}

export default withAuth(Inventory);