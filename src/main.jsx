import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import TransactionHistory from "./pages/TransactionHistory.jsx";
import ProductOrders from "./pages/ProductOrders.jsx";
import Store from "./pages/Store.jsx";
import CreateOrder from "./pages/CreateOrder.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import About from "./pages/About.jsx";
import InventoryReport from "./pages/InventoryReport.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/store",
        element: <Store />,
      },
      {
        path: "/productOrders",
        element: <ProductOrders />,
      },
      {
        path: "/transactionHistory",
        element: <TransactionHistory />,
      },
      {
        path: "/adminpanel",
        element: <AdminPanel />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/reports/inventory",
        element: <InventoryReport />,
      },
      {
        path: "/createOrder",
        element: <CreateOrder />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
