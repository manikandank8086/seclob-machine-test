import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        api.get("/categories"),
        api.get("/subcategories"),
      ]);

      setCategories(catRes.data?.data || []);
      setSubCategories(subRes.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Floating Filter Button (Mobile Only) */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[#EDA415] hover:bg-[#D8940D] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold transition-all active:scale-95 border border-[#c5840c]"
        onClick={() => setOpen(true)}
      >
        <span>🔍 Filters</span>
      </button>

      {/* Overlay Backdrop (Mobile Only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`bg-white border-r h-screen p-5 fixed top-0 left-0 z-50 transition-transform duration-300 w-64 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block md:h-screen md:z-0`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="font-bold text-lg text-[#003B5C]">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-black text-2xl font-semibold px-2"
          >
            ✕
          </button>
        </div>

        <h2 className="font-bold mb-4 text-[#003B5C] hidden md:block">Categories</h2>

        <ul className="space-y-3">
          {/* ALL PRODUCTS */}
          <li
            className="cursor-pointer font-medium hover:text-[#EDA415] transition py-1 text-gray-700"
            onClick={() => {
              setActiveCategory(null);
              onFilterChange({
                type: "all",
                value: null,
              });
              setOpen(false);
            }}
          >
            All Products
          </li>

          {/* CATEGORIES */}
          {categories.map((category) => (
            <li key={category._id} className="py-1">
              {/* CATEGORY */}
              <p
                className={`font-medium cursor-pointer transition ${
                  activeCategory === category._id
                    ? "text-[#EDA415]"
                    : "text-gray-700 hover:text-[#EDA415]"
                }`}
                onClick={() => {
                  const newActive =
                    activeCategory === category._id
                      ? null
                      : category._id;

                  setActiveCategory(newActive);

                  onFilterChange({
                    type: "category",
                    value: category._id,
                  });
                  
                  // If category has no subcategories, close drawer on selection
                  const hasSub = subCategories.some(
                    (sub) => sub.categoryId === category._id
                  );
                  if (!hasSub) {
                    setOpen(false);
                  }
                }}
              >
                {category.name}
              </p>

              {/* SUBCATEGORIES */}
              {activeCategory === category._id && (
                <ul className="ml-4 mt-2 space-y-1.5 text-sm border-l pl-3 border-gray-150">
                  {subCategories
                    .filter(
                      (sub) => sub.categoryId === category._id
                    )
                    .map((sub) => (
                      <li
                        key={sub._id}
                        className="cursor-pointer text-gray-500 hover:text-[#EDA415] transition py-0.5"
                        onClick={() => {
                          onFilterChange({
                            type: "subcategory",
                            value: sub._id,
                          });
                          setOpen(false);
                        }}
                      >
                        {sub.name}
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}