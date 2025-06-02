import React, { useState, useMemo, useEffect } from 'react';

const mockDeliveries = [
  { 
    id: 'ORD001', type: 'Inbound', item: 'Electronics Kit', quantity: 50, srp: 25.00, from: 'Supplier A', to: 'Warehouse 1', date: '2024-05-01', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-01', amountDelivered: 50 }] 
  },
  { 
    id: 'ORD002', type: 'Outbound', item: 'Finished Goods X', quantity: 120, srp: 75.50, from: 'Warehouse 1', to: 'Customer X', date: '2024-05-02', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-02', amountDelivered: 120 }] 
  },
  { 
    id: 'ORD003', type: 'Inbound', item: 'Raw Materials B', quantity: 200, srp: 10.20, from: 'Supplier B', to: 'Warehouse 2', date: '2024-05-03', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-03', amountDelivered: 100 }] 
  },
  { 
    id: 'ORD004', type: 'Outbound', item: 'Components Y', quantity: 75, srp: 5.75, from: 'Warehouse 1', to: 'Assembly Line 1', date: '2024-05-04', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-04', amountDelivered: 50 }] 
  },
  { 
    id: 'ORD005', type: 'Inbound', item: 'Packaging Supplies', quantity: 300, srp: 2.10, from: 'Supplier C', to: 'Warehouse 1', date: '2024-05-05', status: 'Pending Inbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD006', type: 'Outbound', item: 'Product Z', quantity: 90, srp: 150.00, from: 'Warehouse 2', to: 'Retail Store A', date: '2024-05-06', status: 'Pending Outbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD007', type: 'Inbound', item: 'Spare Parts D', quantity: 150, srp: 30.00, from: 'Supplier A', to: 'Warehouse 1', date: '2024-05-07', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-07', amountDelivered: 150 }] 
  },
  { 
    id: 'ORD008', type: 'Outbound', item: 'Custom Order 123', quantity: 10, srp: 500.00, from: 'Warehouse 1', to: 'Client Z', date: '2024-05-08', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-08', amountDelivered: 10 }] 
  },
  { 
    id: 'ORD009', type: 'Inbound', item: 'Chemicals E', quantity: 500, srp: 8.90, from: 'Supplier D', to: 'Warehouse 3', date: '2024-05-09', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-09', amountDelivered: 250 }] 
  },
  { 
    id: 'ORD010', type: 'Outbound', item: 'Bulk Goods F', quantity: 1000, srp: 1.20, from: 'Warehouse 3', to: 'Distributor B', date: '2024-05-10', status: 'Pending Outbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD011', type: 'Inbound', item: 'Textiles G', quantity: 250, srp: 12.50, from: 'Supplier E', to: 'Warehouse 2', date: '2024-05-11', status: 'Pending Inbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD012', type: 'Outbound', item: 'Sample Kit H', quantity: 5, srp: 99.00, from: 'Warehouse 1', to: 'Marketing Dept', date: '2024-05-12', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-12', amountDelivered: 3 }] 
  },
  { 
    id: 'ORD013', type: 'Inbound', item: 'Industrial Tools', quantity: 20, srp: 250.00, from: 'Supplier F', to: 'Warehouse 1', date: '2024-05-13', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-13', amountDelivered: 20 }] 
  },
  { 
    id: 'ORD014', type: 'Outbound', item: 'Office Supplies', quantity: 200, srp: 3.50, from: 'Warehouse 2', to: 'Branch Office A', date: '2024-05-14', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-14', amountDelivered: 200 }] 
  },
  { 
    id: 'ORD015', type: 'Inbound', item: 'Hardware Parts', quantity: 150, srp: 7.80, from: 'Supplier G', to: 'Warehouse 3', date: '2024-05-15', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-15', amountDelivered: 75 }] 
  },
  { 
    id: 'ORD016', type: 'Outbound', item: 'Medical Equipment', quantity: 15, srp: 1200.00, from: 'Warehouse 1', to: 'Hospital B', date: '2024-05-16', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-16', amountDelivered: 10 }] 
  },
  { 
    id: 'ORD017', type: 'Inbound', item: 'Food Supplies', quantity: 500, srp: 1.75, from: 'Supplier H', to: 'Warehouse 2', date: '2024-05-17', status: 'Pending Inbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD018', type: 'Outbound', item: 'Apparel Batch 1', quantity: 300, srp: 25.00, from: 'Warehouse 3', to: 'Retail Chain C', date: '2024-05-18', status: 'Pending Outbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD019', type: 'Inbound', item: 'Automotive Parts', quantity: 80, srp: 45.00, from: 'Supplier I', to: 'Warehouse 1', date: '2024-05-19', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-19', amountDelivered: 80 }] 
  },
  { 
    id: 'ORD020', type: 'Outbound', item: 'Furniture Set', quantity: 5, srp: 800.00, from: 'Warehouse 2', to: 'Customer Y', date: '2024-05-20', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-20', amountDelivered: 5 }] 
  },
  { 
    id: 'ORD021', type: 'Inbound', item: 'Plastic Pellets', quantity: 1200, srp: 0.80, from: 'Supplier J', to: 'Warehouse 3', date: '2024-05-21', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-21', amountDelivered: 600 }] 
  },
  { 
    id: 'ORD022', type: 'Outbound', item: 'Gardening Tools', quantity: 60, srp: 15.00, from: 'Warehouse 1', to: 'Hardware Store D', date: '2024-05-22', status: 'Pending Outbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD023', type: 'Inbound', item: 'Books Collection', quantity: 100, srp: 18.00, from: 'Publisher K', to: 'Warehouse 2', date: '2024-05-23', status: 'Pending Inbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD024', type: 'Outbound', item: 'Sporting Goods', quantity: 40, srp: 55.00, from: 'Warehouse 3', to: 'Sports Club E', date: '2024-05-24', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-24', amountDelivered: 20 }] 
  },
  { 
    id: 'ORD025', type: 'Inbound', item: 'Craft Supplies', quantity: 180, srp: 4.00, from: 'Supplier L', to: 'Warehouse 1', date: '2024-05-25', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-25', amountDelivered: 180 }] 
  },
  { 
    id: 'ORD026', type: 'Outbound', item: 'Pet Food', quantity: 220, srp: 7.00, from: 'Warehouse 2', to: 'Pet Store F', date: '2024-05-26', status: 'Delivered', 
    deliveryDates: [{ date: '2024-05-26', amountDelivered: 220 }] 
  },
  { 
    id: 'ORD027', type: 'Inbound', item: 'Beverages', quantity: 600, srp: 1.50, from: 'Supplier M', to: 'Warehouse 3', date: '2024-05-27', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-27', amountDelivered: 300 }] 
  },
  { 
    id: 'ORD028', type: 'Outbound', item: 'Toys Batch X', quantity: 130, srp: 12.00, from: 'Warehouse 1', to: 'Toy Store G', date: '2024-05-28', status: 'Pending Outbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD029', type: 'Inbound', item: 'Cleaning Supplies', quantity: 270, srp: 6.00, from: 'Supplier N', to: 'Warehouse 2', date: '2024-05-29', status: 'Pending Inbound', 
    deliveryDates: [] 
  },
  { 
    id: 'ORD030', type: 'Outbound', item: 'Building Materials', quantity: 700, srp: 2.00, from: 'Warehouse 3', to: 'Construction Site H', date: '2024-05-30', status: 'In Process', 
    deliveryDates: [{ date: '2024-05-30', amountDelivered: 350 }] 
  },
];

const ITEMS_PER_PAGE = 15; 

const getStatusCategory = (status, type) => {
  if (status === 'Delivered') return 'Delivered';
  if (status === 'In Process') return 'In Process';
  if (status === 'Pending Inbound' && type === 'Inbound') return 'Inbound';
  if (status === 'Pending Outbound' && type === 'Outbound') return 'Outbound';
  return 'Other';
};

const StatusIcon = ({ statusCategory }) => {
  let icon = '';
  let color = '';
  switch (statusCategory) {
    case 'Inbound': icon = '📥'; color = 'text-blue-500'; break;
    case 'Outbound': icon = '📤'; color = 'text-orange-500'; break;
    case 'In Process': icon = '⏳'; color = 'text-yellow-500'; break;
    case 'Delivered': icon = '✅'; color = 'text-green-500'; break;
    default: icon = '❓'; color = 'text-gray-500';
  }
  return <span className={`mr-2 ${color}`}>{icon}</span>;
};

function DeliveryReportTable() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1); 

  const filteredDeliveries = useMemo(() => {
    if (activeTab === 'All') {
      return mockDeliveries;
    }
    return mockDeliveries.filter(delivery => getStatusCategory(delivery.status, delivery.type) === activeTab);
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.ceil(filteredDeliveries.length / ITEMS_PER_PAGE);
  const paginatedDeliveries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDeliveries.slice(startIndex, endIndex);
  }, [currentPage, filteredDeliveries]);

  const tabs = ['All', 'Inbound', 'Outbound', 'In Process', 'Delivered'];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Delivery Report</h1>
        <p className="text-gray-600">Overview of current and past deliveries to store.</p>
      </header>

      <div className="mb-6 flex flex-wrap justify-center space-x-2 sm:space-x-4 rounded-lg bg-gray-100 p-2 shadow">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150
                         ${activeTab === tab
                           ? 'bg-blue-600 text-white shadow-md'
                           : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                         }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SRP</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Quantity Delivered</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From/To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Daily Delivery Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDeliveries.length > 0 ? (
                paginatedDeliveries.map((delivery) => {
                  const statusCategory = getStatusCategory(delivery.status, delivery.type);
                  const totalQuantityDelivered = delivery.deliveryDates.reduce((sum, daily) => sum + daily.amountDelivered, 0);
                  const totalAmount = (totalQuantityDelivered * delivery.srp).toFixed(2); // Calculate total amount

                  return (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          delivery.type === 'Inbound' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {delivery.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{delivery.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${delivery.srp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{totalQuantityDelivered}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {delivery.type === 'Inbound' ? `From: ${delivery.from}` : `To: ${delivery.to}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{delivery.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {delivery.deliveryDates && delivery.deliveryDates.length > 0 ? (
                          <ul className="list-disc list-inside text-xs">
                            {delivery.deliveryDates.map((daily, index) => (
                              <li key={index}>{daily.date}: {daily.amountDelivered} units</li>
                            ))}
                          </ul>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <StatusIcon statusCategory={statusCategory} />
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusCategory === 'Delivered' ? 'bg-green-100 text-green-800' :
                            statusCategory === 'In Process' ? 'bg-yellow-100 text-yellow-800' :
                            statusCategory === 'Inbound' ? 'bg-blue-100 text-blue-800' :
                            statusCategory === 'Outbound' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {delivery.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center text-sm text-gray-500">
                    No deliveries found for "{activeTab}".
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
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredDeliveries.length)}</span> of{' '}
                  <span className="font-medium">{filteredDeliveries.length}</span> results
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
    <DeliveryReportTable />
  );
}