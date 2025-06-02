import React, { useState, useMemo, useEffect } from 'react';

const mockInboundDeliveries = [
  { id: 'REC001', item: 'Electronics Kit', description: 'DIY electronics starter kit', srp: 25.00, receivedQuantity: 50, fromStore: 'Supplier A', receivedDate: '2024-05-01' },
  { id: 'REC002', item: 'Raw Materials B', description: 'Chemical compounds for production', srp: 10.20, receivedQuantity: 200, fromStore: 'Supplier B', receivedDate: '2024-05-03' },
  { id: 'REC003', item: 'Packaging Supplies', description: 'Assorted cardboard boxes and tape', srp: 2.10, receivedQuantity: 300, fromStore: 'Supplier C', receivedDate: '2024-05-05' },
  { id: 'REC004', item: 'Spare Parts D', description: 'Generic machine spare parts', srp: 30.00, receivedQuantity: 150, fromStore: 'Supplier A', receivedDate: '2024-05-07' },
  { id: 'REC005', item: 'Chemicals E', description: 'Industrial cleaning chemicals', srp: 8.90, receivedQuantity: 500, fromStore: 'Supplier D', receivedDate: '2024-05-09' },
  { id: 'REC006', item: 'Textiles G', description: 'Various fabric rolls', srp: 12.50, receivedQuantity: 250, fromStore: 'Supplier E', receivedDate: '2024-05-11' },
  { id: 'REC007', item: 'Industrial Tools', description: 'Heavy-duty wrenches and drills', srp: 250.00, receivedQuantity: 20, fromStore: 'Supplier F', receivedDate: '2024-05-13' },
  { id: 'REC008', item: 'Hardware Parts', description: 'Nuts, bolts, and washers assortment', srp: 7.80, receivedQuantity: 150, fromStore: 'Supplier G', receivedDate: '2024-05-15' },
  { id: 'REC009', item: 'Food Supplies', description: 'Non-perishable canned goods', srp: 1.75, receivedQuantity: 500, fromStore: 'Supplier H', receivedDate: '2024-05-17' },
  { id: 'REC010', item: 'Automotive Parts', description: 'Engine components and filters', srp: 45.00, receivedQuantity: 80, fromStore: 'Supplier I', receivedDate: '2024-05-19' },
  { id: 'REC011', item: 'Plastic Pellets', description: 'Raw plastic for molding', srp: 0.80, receivedQuantity: 1200, fromStore: 'Supplier J', receivedDate: '2024-05-21' },
  { id: 'REC012', item: 'Books Collection', description: 'Assorted fiction and non-fiction books', srp: 18.00, receivedQuantity: 100, fromStore: 'Publisher K', receivedDate: '2024-05-23' },
  { id: 'REC013', item: 'Craft Supplies', description: 'Art and craft materials', srp: 4.00, receivedQuantity: 180, fromStore: 'Supplier L', receivedDate: '2024-05-25' },
  { id: 'REC014', item: 'Beverages', description: 'Soft drinks and bottled water', srp: 1.50, receivedQuantity: 600, fromStore: 'Supplier M', receivedDate: '2024-05-27' },
  { id: 'REC015', item: 'Cleaning Supplies', description: 'Household cleaning products', srp: 6.00, receivedQuantity: 270, fromStore: 'Supplier N', receivedDate: '2024-05-29' },
  { id: 'REC016', item: 'Electronics Kit', description: 'Advanced robotics kit', srp: 35.00, receivedQuantity: 70, fromStore: 'Supplier A', receivedDate: '2024-06-01' },
  { id: 'REC017', item: 'Raw Materials C', description: 'Organic compounds for research', srp: 22.50, receivedQuantity: 150, fromStore: 'Supplier B', receivedDate: '2024-06-02' },
  { id: 'REC018', item: 'Office Furniture', description: 'Desks and chairs', srp: 150.00, receivedQuantity: 10, fromStore: 'Furniture Co.', receivedDate: '2024-06-03' },
  { id: 'REC019', item: 'Medical Disposables', description: 'Gloves, masks, and syringes', srp: 0.75, receivedQuantity: 1000, fromStore: 'Med Supply Inc.', receivedDate: '2024-06-04' },
  { id: 'REC020', item: 'Construction Timber', description: 'Lumber for building projects', srp: 5.00, receivedQuantity: 800, fromStore: 'Timberland Ltd.', receivedDate: '2024-06-05' },
];

const ITEMS_PER_PAGE = 10;

function InboundReportTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockInboundDeliveries.length / ITEMS_PER_PAGE);

  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return mockInboundDeliveries.slice(startIndex, endIndex);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Inbound Report</h1>
        <p className="text-gray-600">Detailed receiving report summary of all received items.</p>
      </header>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SRP</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From Store</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((delivery) => {
                  const receivedAmount = (delivery.receivedQuantity * delivery.srp).toFixed(2);
                  return (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">{delivery.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${delivery.srp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{delivery.receivedQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${receivedAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.fromStore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.receivedDate}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">
                    No inbound deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 bg-white rounded-b-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, mockInboundDeliveries.length)}</span> of{' '}
                  <span className="font-medium">{mockInboundDeliveries.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    {/* Heroicon name: solid/chevron-left */}
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium
                                 ${pageNumber === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Warehouse Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <InboundReportTable />
  );
}