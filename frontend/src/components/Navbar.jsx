import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import api from "../services/api";
import WishlistDrawer from "./WishlistDrawer";

export default function Navbar({
  wishlistCount = 0,
  getImageUrl,
  onSearch,
}) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const openWishlist = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products/wishlist");

      console.log("Wishlist API Response:", res.data);

      setWishlistItems(res.data?.data || []);
      setWishlistOpen(true);
    } catch (error) {
      console.error("Wishlist Error:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSearch = () => {
    if (!search.trim()) return;

    window.location.href = `/home?search=${search}`;
  };



  

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-4 md:px-6 py-3 bg-[#003B5C] text-white">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <span className="font-bold text-xl sm:text-2xl text-[#EDA415] tracking-wider">
            SECLOB
          </span>

          {/* Right Side controls (Mobile Only) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Wishlist */}
            <div
              onClick={openWishlist}
              className="relative cursor-pointer hover:text-red-400 transition"
            >
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Sign In */}
            <button className="bg-white text-black px-3 py-1 rounded-md hover:bg-gray-100 transition text-sm font-medium">
              Sign In
            </button>

            {/* Cart */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#EDA415] transition text-sm">
              <FaShoppingCart />
              <span className="hidden sm:inline">Cart</span>
            </div>
          </div>
        </div>

        {/* Search - Center on desktop, full-width on mobile */}
        <div className="flex-1 flex justify-center max-w-xl mx-auto w-full">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-l-md text-black outline-none text-sm"
            />
            <button
              onClick={handleSearch}
              className="bg-[#EDA415] hover:bg-[#D8940D] transition px-4 sm:px-6 rounded-r-md font-semibold text-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Side controls (Desktop/Tablet Only) */}
        <div className="hidden md:flex items-center gap-5">
          {/* Wishlist */}
          <div
            onClick={openWishlist}
            className="relative cursor-pointer hover:text-red-400 transition"
          >
            <FaHeart className="text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Sign In */}
          <button className="bg-white text-black px-4 py-1 rounded-md hover:bg-gray-100 transition font-medium">
            Sign In
          </button>

          {/* Cart */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-[#EDA415] transition font-medium">
            <FaShoppingCart />
            <span>Cart</span>
          </div>
        </div>
      </div>

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        products={wishlistItems}
        getImageUrl={getImageUrl}
        loading={loading}
      />
    </>
  );
}