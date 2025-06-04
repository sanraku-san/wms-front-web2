import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaImage, FaUpload } from 'react-icons/fa';
import withAuth from '../hoc/withAuth';

function Inventory() {
  const [sortDirection, setSortDirection] = useState("asc");
  const [products, setProducts] = useState([
    // Placeholder data - replace with actual data fetching
    { id: '10310', date: '06 Aug 2020', productName: 'Laptop Pro X', sku: 'LPX-001', stock: 15, price: 1200.00, status: 'In Stock' },
    { id: '25534', date: '01 Feb 2020', productName: 'Mechanical Keyboard', sku: 'MK-005', stock: 50, price: 95.50, status: 'In Stock' },
    { id: '28398', date: '12 Jun 2020', productName: 'Wireless Mouse', sku: 'WM-010', stock: 0, price: 25.00, status: 'Out of Stock' },
    { id: '56416', date: '06 Mar 2020', productName: 'USB-C Hub', sku: 'UCH-003', stock: 30, price: 40.00, status: 'In Stock' },
    { id: '52605', date: '16 Apr 2020', productName: 'External SSD 1TB', sku: 'ESSD-1T', stock: 8, price: 150.00, status: 'Low Stock' },
    { id: '48836', date: '13 Aug 2020', productName: 'Gaming Headset', sku: 'GH-007', stock: 22, price: 75.00, status: 'In Stock' },
    { id: '76844', date: '22 May 2020', productName: 'Monitor 27 inch', sku: 'MON-27', stock: 5, price: 300.00, status: 'Low Stock' },
    { id: '97226', date: '03 Jan 2020', productName: 'Webcam 1080p', sku: 'WBC-002', stock: 18, price: 60.00, status: 'In Stock' },
    { id: '46562', date: '03 May 2020', productName: 'Ergonomic Chair', sku: 'EC-001', stock: 3, price: 250.00, status: 'Low Stock' },
    { id: '84696', date: '09 Dec 2020', productName: 'Desk Lamp with Charger', sku: 'DLC-001', stock: 40, price: 35.00, status: 'In Stock' },
    { id: '48563', date: '17 Sep 2020', productName: 'Portable Projector', sku: 'PP-001', stock: 7, price: 200.00, status: 'In Stock' },
    { id: '11771', date: '06 Apr 2020', productName: 'Noise Cancelling Headphones', sku: 'NCH-001', stock: 10, price: 180.00, status: 'In Stock' },
  ]);

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
            <button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FaFilter /> Filters
            </button>
            <button
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
              Sort
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <FaPlus /> Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <FaImage /> {/* Placeholder for image icon */}
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <FaUpload /> {/* Placeholder for upload icon */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Outlet />
    </div>
  );
}

export default withAuth(Inventory);