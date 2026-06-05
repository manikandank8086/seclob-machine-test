// components/Sidebar.jsx
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* mobile toggle */}
      <button
        className="md:hidden p-2 m-2 border"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div
        className={`bg-white border-r h-screen p-4 transition-all
        ${open ? "block" : "hidden"} md:block w-64`}
      >
        <h2 className="font-bold mb-4">Categories</h2>

        <ul className="space-y-3 text-gray-700">
          <li className="font-medium">All categories</li>

          <li>
            Laptop
            <ul className="ml-4 mt-2 space-y-1 text-sm text-gray-500">
              <li>HP</li>
              <li>Dell</li>
            </ul>
          </li>

          <li>Tablet</li>
          <li>Headphones</li>
        </ul>
      </div>
    </>
  );
}