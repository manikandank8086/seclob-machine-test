import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddProductModal from "../components/AddProductModal";
import api from "../services/api";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);


  const navigate = useNavigate()

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const toggleWishlist = async (id) => {
    try {
      await api.patch(`/products/wishlist/${id}`);

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? {
              ...product,
              wishlist: !product.wishlist,
            }
            : product
        )
      );
    } catch (error) {
      console.log(error);
    }
  };


  const wishlistCount = products.filter((p) => p.wishlist).length;


  /* ---------------- IMAGE HANDLER ---------------- */
  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300";

    if (img.startsWith("http")) return img;

    if (img.startsWith("/uploads")) {
      return IMAGE_BASE_URL + img;
    }

    return IMAGE_BASE_URL + "/uploads/" + img;
  };

  return (
    <div className="min-h-screen bg-gray-50">
   <Navbar
  wishlistCount={wishlistCount}
  getImageUrl={getImageUrl}
/>

      <div className="flex">
        <div className="flex-1 p-4">

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mb-4">

            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-[#EDA415] text-white px-4 py-2 rounded-full"
            >
              Add category
            </button>

            <button
              onClick={() => setShowSubCategoryModal(true)}
              className="bg-[#EDA415] text-white px-4 py-2 rounded-full"
            >
              Add sub category
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#EDA415] text-white px-4 py-2 rounded-full"
            >
              Add product
            </button>

          </div>

          {/* PRODUCT GRID */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg p-4 relative"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt={p.title}
                    className="w-full h-40 object-contain mb-3"
                  />

                  <h2 className="font-semibold text-[#003F62]">
                    {p.title}
                  </h2>

                  <p className="text-[#4A4A4A] font-bold">
                    ${p.variants?.[0]?.price || "0"}
                  </p>

                  <div className="text-[#ACACAC] mt-2">
                    ★ ★ ★ ★ ★
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishlistOpen(true);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-blue/80 backdrop-blur-md shadow-md cursor-pointer transition-all duration-200 hover:scale-110"
                  >
                    {p.wishlist ? (
                      <FaHeart className="text-red-500 text-xl" />
                    ) : (
                      <FaRegHeart className="text-gray-500 text-xl" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className="px-3 py-1 rounded-full border hover:bg-orange-400 hover:text-white"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}

      <AddProductModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          fetchProducts();
        }}
      />

      <AddCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />

      <AddSubCategoryModal
        open={showSubCategoryModal}
        onClose={() => setShowSubCategoryModal(false)}
      />


    </div>
  );
}