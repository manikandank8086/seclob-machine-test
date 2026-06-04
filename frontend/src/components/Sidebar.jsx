// components/Sidebar.jsx
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden p-2 m-2 border"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div
        className={`bg-white shadow-md h-screen p-4 fixed md:static z-50 transition-all
        ${open ? "left-0" : "-left-full"} md:left-0 w-64`}
      >
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        <ul className="space-y-3 text-gray-700">
          <li className="hover:text-orange-500 cursor-pointer">Home</li>
          <li className="hover:text-orange-500 cursor-pointer">Products</li>
          <li className="hover:text-orange-500 cursor-pointer">Orders</li>
          <li className="hover:text-orange-500 cursor-pointer">Wishlist</li>
        </ul>
      </div>
    </>
  );
}