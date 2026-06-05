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
      <div className="flex items-center justify-between px-6 py-3 bg-[#003B5C] text-white">
        {/* Search */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-xl">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-l-md text-black outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-[#EDA415] px-6 rounded-r-md font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Wishlist */}
          <div
            onClick={openWishlist}
            className="relative cursor-pointer"
          >
            <FaHeart className="text-xl" />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Sign In */}
          <button className="bg-white text-black px-4 py-1 rounded-md">
            Sign In
          </button>

          {/* Cart */}
          <div className="flex items-center gap-2 cursor-pointer">
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