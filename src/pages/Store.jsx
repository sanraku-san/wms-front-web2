// src/pages/Store.js
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getStores, addStores, deleteStore } from "../api/stores"; // Assuming these are correctly implemented
import withAuth from "../hoc/withAuth";
import StoreModal from "../components/modals/StoreModal"; // Your existing StoreModal
import DeleteStoreConfirmationModal from "../components/modals/DeleteStoreConfirmationModal"; // Import the new DeleteConfirmationModal
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from 'react-icons/fa'; // Assuming FaSearch is used for no stores found

function Store() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the Add/Edit Store Modal
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [currentStore, setCurrentStore] = useState({
    id: null,
    name: "",
    address: "",
    contact_number: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // State for the Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDeleteId, setStoreToDeleteId] = useState(null);
  const [storeToDeleteName, setStoreToDeleteName] = useState(''); // To display the store name in the confirmation


  // --- API Fetching (remains the same) ---
  useEffect(() => {
    setLoading(true);
    getStores()
      .then((res) => {
        setStores(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
        toast.error("Failed to fetch stores."); // Add a toast for fetch error
        setLoading(false);
      });
  }, []);

  // --- Store Modal Handlers ---

  const handleAdd = () => {
    setCurrentStore({ id: null, name: "", address: "", contact_number: "" });
    setIsEdit(false);
    setShowStoreModal(true);
  };

  const handleEditStore = (store) => {
    setCurrentStore(store);
    setIsEdit(true);
    setShowStoreModal(true);
  };

  const handleCloseStoreModal = () => {
    setShowStoreModal(false);
    // Optionally reset currentStore if you want to clear it on close,
    // though it's already reset on handleAdd and after save.
    setCurrentStore({ id: null, name: "", address: "", contact_number: "" });
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // Assuming your `addStores` API call handles both add and update
        // or you have a separate `updateStore` API.
        // For now, I'll keep your local update logic and note the API part.
        // You'd typically call `updateStore(currentStore.id, currentStore)` here.

        // Simulating update:
        const updatedStores = stores.map((store) =>
          store.id === currentStore.id ? { ...store, ...currentStore } : store
        );
        setStores(updatedStores);
        toast.info("Store updated successfully!");
      } else {
        const newStore = await addStores(currentStore); // This should be `addStore` singular if it adds one
        if (newStore && newStore.data) {
          setStores([...stores, newStore.data]);
          toast.success("Store added successfully!");
        } else {
          // Handle cases where newStore.data might be missing but no error was thrown
          toast.warning("Store added, but data might be incomplete.");
        }
      }
      setShowStoreModal(false);
      setCurrentStore({ id: null, name: "", address: "", contact_number: "" });
    } catch (error) {
      console.error("Error saving store:", error);
      toast.error("Error saving store. Please try again."); // Changed to error toast
    }
  };

  // --- Delete Modal Handlers ---

  const handleDeleteClick = (id, name) => {
    setStoreToDeleteId(id);
    setStoreToDeleteName(name); // Set the name for the confirmation message
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setStoreToDeleteId(null);
    setStoreToDeleteName(''); // Clear the name on close
  };

  const handleConfirmDelete = () => {
    if (storeToDeleteId) {
      deleteStore(storeToDeleteId)
        .then(() => { // No res needed here typically for delete
          toast.info("Store deleted successfully!");
          setStores(stores.filter((store) => store.id !== storeToDeleteId));
          handleCloseDeleteModal(); // Close the modal after successful deletion
        })
        .catch((error) => {
          console.error("Failed to delete store:", error);
          toast.error("Failed to delete store.");
          handleCloseDeleteModal(); // Close even if deletion failed, user can retry
        });
    }
  };

  return (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Store Management
            </h1>
            <p className="text-gray-500 mt-1">Manage your store locations</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            + Add Store
          </button>
        </div>
      </div>

      {/* Store Grid */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        {loading ? (
           <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
         </div>
        ): stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
                      <FaSearch className="text-gray-400 text-4xl mb-4" /> {/* Re-using FaSearch for a "no results" icon */}
                      <h3 className="text-lg font-medium text-gray-900">
                        No stores found
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Click "Add Store" to create your first store.
                      </p>
                    </div>
        ):(
           <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {store?.name}
                </h2>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Address
                  </p>
                  <p className="text-sm text-gray-700 break-words">
                    {store.address}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-sm text-gray-700">
                    {store.contact_number}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex gap-2">
                <button
                  onClick={() => handleEditStore(store)}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium text-sm flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(store.id, store.name)} 
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {/* This condition `stores.length === 0` is now redundant due to the earlier check */}
          {/* You can remove this or ensure it's handled correctly */}
          {/* {stores.length === 0 && (
            <div className="col-span-full py-10 text-gray-400 text-center text-lg bg-white rounded-xl shadow">
              No stores found.
            </div>
          )} */}
        </div>
        )}
      </div>

      {/* Modal for Add/Edit Store */}
      <StoreModal
        isOpen={showStoreModal}
        onClose={handleCloseStoreModal}
        onSave={handleSaveStore}
        currentStore={currentStore}
        isEdit={isEdit}
        setCurrentStore={setCurrentStore}
      />

      {/* Modal for Delete Confirmation */}
      <DeleteStoreConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={storeToDeleteName} // Pass the name for the message
      />

      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default withAuth(Store);