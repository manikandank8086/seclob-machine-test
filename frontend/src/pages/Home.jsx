// pages/Home.jsx
import Navbar from "../components/Navbar";

const products = [
  { id: 1, name: "HP Ryzen 3", price: 529, img: "https://via.placeholder.com/150" },
  { id: 2, name: "Dell Laptop", price: 649, img: "https://via.placeholder.com/150" },
  { id: 3, name: "Lenovo IdeaPad", price: 599, img: "https://via.placeholder.com/150" },
];

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-3 shadow hover:shadow-lg">
            <img src={p.img} className="w-full h-40 object-cover" />
            <h2 className="font-semibold mt-2">{p.name}</h2>
            <p className="text-orange-500">${p.price}</p>

            <button className="mt-2 w-full bg-orange-500 text-white py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}