import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProductSchema } from "../validation/productSchema";
import { createProduct } from "../services/productService";
import { toast } from "react-toastify";
import api from "../services/api";

export default function AddProductModal({ open, onClose }) {
  if (!open) return null;



  const [subCategories, setSubCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [dropdownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await api.get("/subcategories");
        setSubCategories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load subcategories");
      }
    };

    fetchSubCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductSchema),
    defaultValues: {
      title: "",
      subCategory: "",
      description: "",
      variants: [
        { ram: "4 GB", price: "$529.99", qty: 1 },
        { ram: "8 GB", price: "$929.99", qty: 3 },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "variants",
  });

  /* ---------------- FILE PREVIEW ---------------- */
  const files = watch("files");
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const images = Array.from(files).slice(0, 2).map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(images);

    return () => {
      images.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      console.log("SENDING TO BACKEND:", data);

      const res = await createProduct(data);

      console.log("SUCCESS RESPONSE:", res.data);

      toast.success("Product created successfully!");

      onClose();
    } catch (error) {
      console.error("ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to create product"
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black transition"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center mb-5 text-[#003B5C]">
          Add Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Title :</label>
            <div className="flex-1 w-full">
              <input
                {...register("title")}
                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-[#EDA415] outline-none transition"
                placeholder="HP AMD Ryzen 3"
              />
              <p className="text-red-500 text-sm mt-0.5">
                {errors.title?.message}
              </p>
            </div>
          </div>

          {/* VARIANTS */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base sm:pt-2">
              Variants :
            </label>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-3 text-xs sm:text-sm text-gray-400 mb-2 px-2">
                <span>Ram</span>
                <span>Price</span>
                <span>QTY</span>
              </div>

              <div className="space-y-2">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-gray-50 border rounded-lg px-2 py-2 items-center"
                  >
                    <input
                      {...register(`variants.${index}.ram`)}
                      className="border rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                      placeholder="RAM"
                    />

                    <input
                      {...register(`variants.${index}.price`)}
                      className="border rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                      placeholder="Price"
                    />

                    <input
                      type="number"
                      {...register(`variants.${index}.qty`)}
                      className="border rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() =>
                    append({ ram: "", price: "", qty: 1 })
                  }
                  className="bg-gray-800 hover:bg-gray-700 transition text-white px-3 py-1 rounded-lg text-xs sm:text-sm"
                >
                  Add variants
                </button>
              </div>
            </div>
          </div>

          {/* SUB CATEGORY */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Sub Category :</label>

            <div className="relative flex-1 w-full">
              {/* SELECT BOX */}
              <div
                onClick={() => setDropDownOpen((prev) => !prev)}
                className="w-full border rounded-lg px-3 py-2 cursor-pointer bg-white text-sm sm:text-base flex justify-between items-center outline-none focus:border-[#EDA415]"
              >
                <span>{selected || "Select Sub Category"}</span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg max-h-48 overflow-y-auto shadow-lg">
                  {subCategories.length === 0 ? (
                    <div className="px-3 py-2 text-gray-400 text-sm">
                      No subcategories
                    </div>
                  ) : (
                    subCategories.map((sc) => (
                      <div
                        key={sc._id}
                        onClick={() => {
                          setSelected(sc.name);
                          setValue("subCategory", sc.name);
                          setDropDownOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                      >
                        {sc.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Description :</label>
            <div className="flex-1 w-full">
              <textarea
                rows="2"
                {...register("description")}
                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-[#EDA415] outline-none transition"
                placeholder="Product description..."
              />
              <p className="text-red-500 text-sm mt-0.5">
                {errors.description?.message}
              </p>
            </div>
          </div>

          {/* FILE UPLOAD + PREVIEW (2 IMAGES) */}
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
            <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Upload :</label>

            <div className="flex-1 w-full">
              <div className="flex flex-wrap gap-3">
                {/* IMAGE 1 */}
                <div className="w-20 h-20 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {previews[0] ? (
                    <img
                      src={previews[0]}
                      className="w-full h-full object-cover"
                      alt="Preview 1"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl">📷</span>
                  )}
                </div>

                {/* IMAGE 2 */}
                <div className="w-20 h-20 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {previews[1] ? (
                    <img
                      src={previews[1]}
                      className="w-full h-full object-cover"
                      alt="Preview 2"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl">📷</span>
                  )}
                </div>

                {/* UPLOAD BUTTON */}
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-400 hover:text-gray-600">
                  <span className="text-2xl font-light">+</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("files")}
                    hidden
                  />
                </label>
              </div>

              {errors.files?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.files?.message}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 transition px-5 py-2 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
              DISCARD
            </button>

            <button
              type="submit"
              className="bg-[#EDA415] hover:bg-[#D8940D] transition text-white px-5 py-2 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
              ADD
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}