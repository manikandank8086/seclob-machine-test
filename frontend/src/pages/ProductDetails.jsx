// pages/ProductDetails.jsx
import Navbar from "../components/Navbar";

export default function ProductDetails() {
  return (
    <div>
      <Navbar />

      <div className="p-6 grid md:grid-cols-2 gap-6">
        <img
          src="https://via.placeholder.com/400"
          className="w-full rounded"
        />

        <div>
          <h1 className="text-2xl font-bold">HP AMD Ryzen 3</h1>
          <p className="text-orange-500 text-xl">$529.99</p>

          <p className="mt-3 text-gray-600">
            High performance laptop with Ryzen processor and SSD storage.
          </p>

          <div className="mt-4 flex gap-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Buy Now
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}