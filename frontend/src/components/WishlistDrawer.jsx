import { X } from "lucide-react";

export default function WishlistDrawer({
  open,
  onClose,
  products = [],
  loading,
}) {
  if (!open) return null;


  /* ---------------- IMAGE ---------------- */
const IMAGE_BASE_URL = "https://seclob-machine-test.onrender.com";
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return IMAGE_BASE_URL + img;
    return IMAGE_BASE_URL + "/uploads/" + img;
  };


  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-[380px] bg-white z-50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold">
            Wishlist Items
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-10">
              Loading...
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No wishlist items found
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 border-b pb-4"
                >
                  <img
                    src={
                      getImageUrl
                        ? getImageUrl(item.images?.[0])
                        : item.images?.[0]
                    }
                    alt={item.title}
                    className="w-20 h-20 object-contain border rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {item.title}
                    </h3>

                    <p className="font-bold text-[#003F62] mt-1">
                      ₹{item?.variants?.[0]?.price || 0}
                    </p>

                    <div className="text-yellow-500 text-sm mt-1">
                      ★★★★★
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}