import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCategorySchema } from "../validation/subCategorySchema";
import api from "../services/api";
import { toast } from "react-toastify";

export default function AddSubCategoryModal({ open, onClose }) {
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(subCategorySchema),
  });

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data || []);
  };

  if (!open) return null;

  const onSubmit = async (data) => {
    try {
      await api.post("/subcategories/create", data);

      toast.success("Sub category created");

      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to create sub category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto text-center shadow-xl">

        <h2 className="text-lg font-bold mb-4">Add Sub Category</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* CATEGORY */}
          <select
            {...register("categoryId")}
            className="w-full border p-2 rounded mb-1"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <p className="text-red-500 text-sm mb-2">
            {errors.categoryId?.message}
          </p>

          {/* NAME */}
          <input
            {...register("name")}
            className="w-full border p-2 rounded mb-1"
            placeholder="Enter sub category"
          />

          <p className="text-red-500 text-sm mb-3">
            {errors.name?.message}
          </p>

          {/* BUTTONS */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Discard
            </button>

            <button
              type="submit"
              className="bg-[#EDA415] text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}