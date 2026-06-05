import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(true);
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
      <button
        className="md:hidden p-2 m-2 border"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div
        className={`bg-white border-r h-screen p-4 transition-all ${
          open ? "block" : "hidden"
        } md:block w-64`}
      >
        <h2 className="font-bold mb-4">Categories</h2>

        <ul className="space-y-3">

          {/* ALL PRODUCTS */}
          <li
            className="cursor-pointer font-medium hover:text-[#EDA415]"
            onClick={() => {
              setActiveCategory(null);
              onFilterChange({
                type: "all",
                value: null,
              });
            }}
          >
            All Products
          </li>

          {/* CATEGORIES */}
          {categories.map((category) => (
            <li key={category._id}>
              
              {/* CATEGORY */}
              <p
                className={`font-medium cursor-pointer ${
                  activeCategory === category._id
                    ? "text-[#EDA415]"
                    : ""
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
                }}
              >
                {category.name}
              </p>

              {/* SUBCATEGORIES */}
              {activeCategory === category._id && (
                <ul className="ml-4 mt-2 space-y-1 text-sm">
                  {subCategories
                    .filter(
                      (sub) => sub.categoryId === category._id
                    )
                    .map((sub) => (
                      <li
                        key={sub._id}
                        className="cursor-pointer hover:text-[#EDA415]"
                        onClick={() =>
                          onFilterChange({
                            type: "subcategory",
                            value: sub._id,
                          })
                        }
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