import { useEffect, useState } from "react";
import api from "../services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";

export default function Home({
  filter,
  products,
  setProducts,
  searchTerm,
}) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // MODALS
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 6;

  /* ---------------- FETCH ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  /* ---------------- WISHLIST ---------------- */
  const toggleWishlist = async (id) => {
    try {
      await api.patch(`/products/wishlist/${id}`);

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, wishlist: !p.wishlist } : p
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredProducts = (products || [])
    .filter((product) => {
      if (!filter || filter.type === "all") return true;

      if (filter.type === "category") {
        return product.categoryId?.toString() === filter.value;
      }

      if (filter.type === "subcategory") {
        return product.subCategoryId?.toString() === filter.value;
      }

      return true;
    })
    .filter((product) =>
      (product?.title || "")
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    );

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ---------------- IMAGE ---------------- */
  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return IMAGE_BASE_URL + img;
    return IMAGE_BASE_URL + "/uploads/" + img;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-2 mb-6 mt-2">
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-[#EDA415] hover:bg-[#D8940D] transition text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm flex-1 sm:flex-initial text-center min-w-[120px]"
        >
          Add Category
        </button>

        <button
          onClick={() => setShowSubCategoryModal(true)}
          className="bg-[#EDA415] hover:bg-[#D8940D] transition text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm flex-1 sm:flex-initial text-center min-w-[140px]"
        >
          Add Sub Category
        </button>

        <button
          onClick={() => setShowProductModal(true)}
          className="bg-[#EDA415] hover:bg-[#D8940D] transition text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm w-full sm:w-auto text-center"
        >
          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {paginatedProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow p-4 relative cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={getImageUrl(p.images?.[0])}
                  className="h-40 w-full object-contain mb-2"
                  alt=""
                />

                <h2 className="font-semibold text-[#003F62]">
                  {p.title || "No Title"}
                </h2>

                <p className="font-bold text-gray-700">
                  {p?.variants?.[0]?.price || 0}
                </p>

                {/* WISHLIST */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p._id);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow"
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

          {/* PAGINATION */}
          <div className="flex flex-wrap justify-center items-center mt-8 gap-1.5 px-2 pb-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 border rounded disabled:opacity-40 hover:bg-gray-100 transition text-sm font-medium"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border rounded text-sm transition font-medium ${
                  currentPage === i + 1
                    ? "bg-black text-white border-black"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 border rounded disabled:opacity-40 hover:bg-gray-100 transition text-sm font-medium"
            >
              Next
            </button>

          </div>
        </>
      )}

      {/* MODALS */}
      <AddProductModal
        open={showProductModal}
        onClose={() => {
          setShowProductModal(false);
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