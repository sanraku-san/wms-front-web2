import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import withAuth from '../hoc/withAuth';


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP' 
    }).format(amount);
};

function TransactionHistory() {

  return (
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 space-y-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>

              {/* Transaction List */}
                  <div className="mt-8 space-y-4">
               
          </div>
      </div>
      </div>
  );
}
export default withAuth(TransactionHistory);
