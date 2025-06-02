import React, { useState, useMemo, useEffect } from 'react';

const mockInventory = [
  { id: 'INV001', item: 'Steel Rods - 10mm', description: 'High-tensile steel rods for construction, 10mm diameter.', quantity: 500, unitPrice: 2.50, supplier: 'Steel Co.', dateReceived: '2024-05-01' },
  { id: 'INV002', item: 'Cement Bags - 50kg', description: 'Portland cement, 50kg bags, general purpose.', quantity: 1200, unitPrice: 5.00, supplier: 'Cement Works', dateReceived: '2024-05-02' },
  { id: 'INV003', item: 'Safety Helmets', description: 'Yellow hard hats, ANSI Z89.1 certified.', quantity: 200, unitPrice: 12.75, supplier: 'Safety Gear Inc.', dateReceived: '2024-05-03' },
  { id: 'INV004', item: 'Work Gloves - Leather', description: 'Heavy-duty leather work gloves, size L.', quantity: 350, unitPrice: 8.50, supplier: 'Safety Gear Inc.', dateReceived: '2024-05-03' },
  { id: 'INV005', item: 'Copper Wires - 2.5mm', description: 'Insulated copper wiring, 2.5mm gauge, 100m rolls.', quantity: 3000, unitPrice: 0.80, supplier: 'Electro Supplies', dateReceived: '2024-05-04' },
  { id: 'INV006', item: 'LED Bulbs - 10W', description: 'Energy-efficient LED bulbs, 10W, E27 base, warm white.', quantity: 800, unitPrice: 3.20, supplier: 'Bright Lights Ltd.', dateReceived: '2024-05-05' },
  { id: 'INV007', item: 'Paint Cans - White', description: 'Interior latex paint, white, 1 gallon cans.', quantity: 150, unitPrice: 15.00, supplier: 'ColorMaster', dateReceived: '2024-05-06' },
  { id: 'INV008', item: 'Plywood Sheets - 12mm', description: 'Standard plywood sheets, 4x8 ft, 12mm thickness.', quantity: 250, unitPrice: 18.00, supplier: 'Wood World', dateReceived: '2024-05-07' },
  { id: 'INV009', item: 'Nails - Assorted Sizes', description: 'Box of assorted steel nails, various sizes.', quantity: 10000, unitPrice: 0.02, supplier: 'Hardware Central', dateReceived: '2024-05-08' },
  { id: 'INV010', item: 'Screws - Assorted Sizes', description: 'Box of assorted steel screws, Phillips head.', quantity: 15000, unitPrice: 0.03, supplier: 'Hardware Central', dateReceived: '2024-05-08' },
  { id: 'INV011', item: 'PVC Pipes - 4inch', description: 'PVC pipes, 4-inch diameter, 10ft length.', quantity: 400, unitPrice: 7.50, supplier: 'Plumb Perfect', dateReceived: '2024-05-09' },
  { id: 'INV012', item: 'Power Drills', description: 'Cordless power drills, 18V, with battery and charger.', quantity: 50, unitPrice: 75.00, supplier: 'Tool Time', dateReceived: '2024-05-10' },
  { id: 'INV013', item: 'Wrench Set', description: 'Combination wrench set, 12 pieces, metric.', quantity: 75, unitPrice: 22.00, supplier: 'Tool Time', dateReceived: '2024-05-10' },
  { id: 'INV014', item: 'Insulation Foam Rolls', description: 'Foam insulation rolls, R-13 value, 24-inch width.', quantity: 100, unitPrice: 30.00, supplier: 'BuildRight Supplies', dateReceived: '2024-05-11' },
  { id: 'INV015', item: 'Tarpaulin Sheets - Blue', description: 'Heavy-duty blue tarpaulin, 10x12 ft.', quantity: 300, unitPrice: 9.00, supplier: 'CoverAll Inc.', dateReceived: '2024-05-12' },
  { id: 'INV016', item: 'Extension Cords - 10m', description: 'Outdoor extension cords, 10 meters, 16 AWG.', quantity: 120, unitPrice: 11.50, supplier: 'Electro Supplies', dateReceived: '2024-05-13' },
  { id: 'INV017', item: 'Ladders - Aluminium 6ft', description: 'Aluminium stepladder, 6ft height, Type IA.', quantity: 30, unitPrice: 45.00, supplier: 'StepUp Solutions', dateReceived: '2024-05-14' },
  { id: 'INV018', item: 'Measuring Tapes - 5m', description: 'Retractable measuring tapes, 5 meters / 16 feet.', quantity: 200, unitPrice: 4.75, supplier: 'Hardware Central', dateReceived: '2024-05-15' },
  { id: 'INV019', item: 'Duct Tape Rolls', description: 'Silver duct tape rolls, 2-inch width, 50 yards.', quantity: 500, unitPrice: 3.50, supplier: 'Adhesive Masters', dateReceived: '2024-05-16' },
  { id: 'INV020', item: 'Safety Glasses', description: 'Clear safety glasses, anti-scratch, UV protection.', quantity: 400, unitPrice: 2.25, supplier: 'Safety Gear Inc.', dateReceived: '2024-05-17' },
  { id: 'INV021', item: 'Bricks - Red Clay', description: 'Standard red clay bricks for construction.', quantity: 5000, unitPrice: 0.50, supplier: 'ClayWorks Ltd.', dateReceived: '2024-05-18' },
  { id: 'INV022', item: 'Sand - Construction Grade (Ton)', description: 'Washed construction sand, sold per ton.', quantity: 20, unitPrice: 25.00, supplier: 'Quarry Direct', dateReceived: '2024-05-19' },
  { id: 'INV023', item: 'Gravel - Pea (Ton)', description: 'Pea gravel for landscaping and concrete, sold per ton.', quantity: 15, unitPrice: 30.00, supplier: 'Quarry Direct', dateReceived: '2024-05-19' },
  { id: 'INV024', item: 'Welding Machine', description: 'Arc welding machine, 220V, portable.', quantity: 10, unitPrice: 180.00, supplier: 'MetalFab Tools', dateReceived: '2024-05-20' },
  { id: 'INV025', item: 'Welding Rods - E6013', description: 'E6013 welding rods, 1/8 inch, 5lb pack.', quantity: 800, unitPrice: 0.10, supplier: 'MetalFab Tools', dateReceived: '2024-05-20' },
  { id: 'INV026', item: 'Tile Adhesive - 20kg bags', description: 'Premium tile adhesive, 20kg bags, for ceramic tiles.', quantity: 250, unitPrice: 12.00, supplier: 'TileFix Pro', dateReceived: '2024-05-21' },
  { id: 'INV027', item: 'Grout - White', description: 'Non-sanded grout, white, 5lb bags.', quantity: 100, unitPrice: 6.50, supplier: 'TileFix Pro', dateReceived: '2024-05-21' },
  { id: 'INV028', item: 'Window Glass Panels', description: 'Tempered glass panels for windows, 24x36 inches.', quantity: 60, unitPrice: 35.00, supplier: 'ClearView Glass', dateReceived: '2024-05-22' },
  { id: 'INV029', item: 'Door Hinges - Stainless Steel', description: 'Stainless steel door hinges, 3.5 inch, pair.', quantity: 300, unitPrice: 3.00, supplier: 'Hardware Central', dateReceived: '2024-05-23' },
  { id: 'INV030', item: 'Padlocks - Medium Security', description: 'Medium security padlocks with 2 keys.', quantity: 150, unitPrice: 7.00, supplier: 'SecureLock Co.', dateReceived: '2024-05-24' },
  { id: 'INV031', item: 'Rope - Nylon 10mm (Meter)', description: 'Durable nylon rope, 10mm thickness, sold per meter.', quantity: 1000, unitPrice: 0.75, supplier: 'StrongHold Ropes', dateReceived: '2024-05-25' },
];

const ITEMS_PER_PAGE = 15; 

const QuantityIndicator = ({ quantity }) => {
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-800';
  let level = 'Healthy Stock';

  if (quantity < 50) {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    level = 'Low Stock';
  } else if (quantity < 200) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    level = 'Medium Stock';
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {level} ({quantity})
    </span>
  );
};


function InventoryReportTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const searchedInventory = useMemo(() => {
    if (!searchTerm) {
      return mockInventory;
    }
    return mockInventory.filter(item =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(searchedInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return searchedInventory.slice(startIndex, endIndex);
  }, [currentPage, searchedInventory]);


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Report</h1>
        <p className="text-gray-600">Current stock levels and received items.</p>
      </header>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by Item, ID, Supplier, or Description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-2/3 lg:w-1/2"
        />
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity in Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Received</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => {
                  const stockValue = item.quantity * item.unitPrice;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs whitespace-normal break-words">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <QuantityIndicator quantity={item.quantity} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">{formatCurrency(stockValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.dateReceived}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500">
                    No inventory items found{searchTerm && ` for "${searchTerm}"`}.
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
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, searchedInventory.length)}</span> of{' '}
                  <span className="font-medium">{searchedInventory.length}</span> results
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
    <InventoryReportTable />
  );
}
