import {  Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { HashRouter } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
  const location = useLocation();

  const [filter, setFilter] = useState({
    type: "all",
    value: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const hideSidebar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/product");

    const hideNavbar =
  location.pathname === "/" ||
  location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* NAVBAR */}
      {!hideNavbar && (
  <div className="sticky top-0 z-50">
    <Navbar
      wishlistCount={products.filter((p) => p.wishlist).length}
      onSearch={setSearchTerm}
    />
  </div>
)}

      {/* BODY */}
      <div className="flex flex-1">
        {!hideSidebar && (
          <Sidebar onFilterChange={setFilter} />
        )}

        <div className="flex-1 min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home
                    filter={filter}
                    products={products}
                    setProducts={setProducts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails
                    products={products}
                    setProducts={setProducts}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}