import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import withAuth from '../hoc/withAuth'

function Store() {
  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Store Management</h1>
            <p className="text-gray-500 mt-1">Manage your store locations</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
            + Add Store
          </button>
        </div>
      </div>

      {/* Store Grid */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
       
      </div>

      <Outlet />
    </div>
  )
}

export default withAuth(Store)
