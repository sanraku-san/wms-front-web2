import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getStores, addStores, deleteStore } from "../api/stores";
import { getUser } from "../api/auth"; 
import withAuth from "../hoc/withAuth";
import StoreModal from "../components/modals/StoreModal";
import DeleteStoreConfirmationModal from "../components/modals/DeleteStoreConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

function Store() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [currentStore, setCurrentStore] = useState({
    id: null,
    name: "",
    address: "",
    contact_number: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDeleteId, setStoreToDeleteId] = useState(null);
  const [storeToDeleteName, setStoreToDeleteName] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const authToken = sessionStorage.getItem("authToken");

      if (authToken) {
        try {
          const userData = await getUser(authToken);
          if (userData && userData.data && userData.data.roles && userData.data.roles.length > 0) {
            setCurrentUserRole(userData.data.roles[0].name);
          } else {
            console.warn("User data received but no role found. Defaulting to 'viewer'.", userData);
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

      getStores()
        .then((res) => {
          setStores(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching stores:", error);
          toast.error("Failed to fetch stores.");
          setLoading(false);
        });
    };

    fetchInitialData();
  }, []);

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
    setCurrentStore({ id: null, name: "", address: "", contact_number: "" });
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();

    const contactNumber = currentStore.contact_number;
    const phNumberRegex = /^09\d{9}$/;

    if (contactNumber.length < 11) {
      toast.error("Invalid PH number. Please enter a total of 11 digits.");
      return;
    }

    if (contactNumber.length > 11) {
      toast.error("Invalid PH number. Please enter a total of 11 digits only.");
      return;
    }

    if (!phNumberRegex.test(contactNumber)) {
      toast.error(
        "Invalid PH number, it must start with '09' and contain 11 digits."
      );
      return;
    }
    try {
      if (isEdit) {
        const updatedStores = stores.map((store) =>
          store.id === currentStore.id ? { ...store, ...currentStore } : store
        );
        setStores(updatedStores);
        toast.info("Store updated successfully!");
      } else {
        const newStore = await addStores(currentStore);
        if (newStore && newStore.data) {
          setStores([...stores, newStore.data]);
          toast.success("Store added successfully!");
        } else {
          toast.warning("Store added, but data might be incomplete.");
        }
      }
      setShowStoreModal(false);
      setCurrentStore({ id: null, name: "", address: "", contact_number: "" });
    } catch (error) {
      console.error("Error saving store:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          errors[key].forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Error saving store. Please try again.");
      }
    }
  };

  const handleDeleteClick = (id, name) => {
    setStoreToDeleteId(id);
    setStoreToDeleteName(name);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setStoreToDeleteId(null);
    setStoreToDeleteName("");
  };

  const handleConfirmDelete = () => {
    if (storeToDeleteId) {
      deleteStore(storeToDeleteId)
        .then(() => {
          toast.info("Store deleted successfully!");
          setStores(stores.filter((store) => store.id !== storeToDeleteId));
          handleCloseDeleteModal();
        })
        .catch((error) => {
          console.error("Failed to delete store:", error);
          toast.error("Failed to delete store.");
          handleCloseDeleteModal();
        });
    }
  };
  const isViewer = currentUserRole === 'viewer'; 

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
          {!isViewer && (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              + Add Store
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FaSearch className="text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No stores found
            </h3>
            <p className="text-gray-500 mt-1">
              Click "Add Store" to create your first store.
            </p>
          </div>
        ) : (
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
                {!isViewer && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <StoreModal
        isOpen={showStoreModal}
        onClose={handleCloseStoreModal}
        onSave={handleSaveStore}
        currentStore={currentStore}
        isEdit={isEdit}
        setCurrentStore={setCurrentStore}
      />

      <DeleteStoreConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={storeToDeleteName}
      />

      <Outlet />
      <ToastContainer />
    </div>
  );
}

export default withAuth(Store);