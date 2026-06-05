import { Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import EditProductModal from "../components/EditProductModal";


export default function ProductDetails({ products, setProducts }) {
  const { id } = useParams();
  const navigate = useNavigate()

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const [editOpen, setEditOpen] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data?.data;

        console.log("Product:", data);

        setProduct(data);

        if (data?.images?.length > 0) {
          setSelectedImage(data.images[0]);
        }

        if (data?.variants?.length > 0) {
          setSelectedRam(data.variants[0].ram);
        }
      } catch (error) {
        console.log("Product Fetch Error:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const res = await api.get("/products/wishlist");

        setWishlistCount(res.data?.data?.length || 0);
      } catch (error) {
        console.log("Wishlist Count Error:", error);
      }
    };

    fetchWishlistCount();
  }, []);


  const handleProductUpdated = (updatedProduct) => {
    setProduct(updatedProduct);

    if (updatedProduct?.images?.length) {
      setSelectedImage(updatedProduct.images[0]);
    }

    if (updatedProduct?.variants?.length) {
      setSelectedRam(updatedProduct.variants[0].ram);
    }
  };




  const toggleWishlist = async (id) => {
    try {
      const res = await api.patch(`/products/wishlist/${id}`);

      const updatedWishlist = res.data.product.wishlist;

      setProduct((prev) => ({
        ...prev,
        wishlist: updatedWishlist,
      }));

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, wishlist: updatedWishlist } : p
        )
      );

    } catch (error) {
      console.log(error);
    }
  };







  /* ---------------- IMAGE HANDLER ---------------- */

  const IMAGE_BASE_URL = "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x400";

    if (img.startsWith("http")) return img;

    if (img.startsWith("/uploads")) {
      return `${IMAGE_BASE_URL}${img}`;
    }

    return `${IMAGE_BASE_URL}/uploads/${img}`;
  };

  const selectedVariant =
    product?.variants?.find((v) => v.ram === selectedRam) ||
    product?.variants?.[0];

  if (!product) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  const thumbnails =
    product?.images?.length >= 2
      ? product.images.slice(0, 2)
      : [product?.images?.[0], product?.images?.[0]];


  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <div className="w-full sticky top-0 z-50 shadow-sm bg-white">
        {/* <Navbar
          wishlistCount={wishlistCount}
          getImageUrl={getImageUrl}
        /> */}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm text-gray-500 px-6 mt-4 mb-6">
        <span
          onClick={() => navigate("/home")}
          className="cursor-pointer hover:text-black"
        >
          Home
        </span>
        <span>{">"}</span>
        <span>Product Details</span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 pb-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center">

          {/* MAIN IMAGE */}
          <div className="w-full max-w-md border rounded-2xl h-[420px] flex items-center justify-center bg-white shadow-sm">
            <img
              src={getImageUrl(selectedImage)}
              alt={product.title}
              className="max-h-[320px] object-contain"
            />
          </div>

          {/* THUMBNAILS (BOTTOM CENTERED) */}
          <div className="flex gap-4 mt-5 justify-center">
            {thumbnails.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-20 border rounded-xl flex items-center justify-center transition`}

              >
                <img
                  src={getImageUrl(img)}
                  alt="thumbnail"
                  className="w-16 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="max-w-xl">

          <h1 className="text-3xl font-semibold text-[#0B4A75] mb-3">
            {product.title}
          </h1>

          <p className="text-3xl font-bold text-gray-800 mb-5">
            {selectedVariant?.price}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-700">Availability:</span>
            <span className="text-green-600 font-medium">✓ In stock</span>
          </div>

          <p className="text-sm text-gray-400 mb-8">
            Hurry up! only 34 product left in stock!
          </p>

          <hr className="mb-6" />

          {/* RAM */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Ram:</h3>

              <div className="flex gap-3 flex-wrap">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRam(v.ram)}
                    className={`px-4 py-2 border rounded text-sm
                  ${selectedRam === v.ram
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                      }`}
                  >
                    {v.ram}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QTY */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Quantity:</h3>

            <div className="inline-flex border rounded overflow-hidden">
              <button
                onClick={() => setQuantity((p) => (p > 1 ? p - 1 : 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>

              <span className="px-5 py-2 border-x">{quantity}</span>

              <button
                onClick={() => setQuantity((p) => p + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 items-center">

            <button
              onClick={() => setEditOpen(true)}
              className="bg-[#E8A313] text-white px-8 py-3 rounded-full"
            >
              Edit Product
            </button>

            <button className="bg-[#E8A313] text-white px-8 py-3 rounded-full">
              Buy It Now
            </button>

            <button
              onClick={() => toggleWishlist(product._id)}
              className="w-12 h-12 rounded-full border flex items-center justify-center hover:scale-110 transition"
            >
              {product.wishlist ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

        </div>
      </div>



      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        onProductUpdated={handleProductUpdated}
      />




    </div>
  );
}