import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { categorySchema } from "../validation/categorySchema";
import api from "../services/api";
import { toast } from "react-toastify";

export default function AddCategoryModal({ open, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
  });

  if (!open) return null;

  const onSubmit = async (data) => {
    try {
      await api.post("/categories/create", data);

      toast.success("Category created");

      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-auto text-center shadow-xl">

        <h2 className="text-lg font-bold mb-4">Add Category</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <input
            {...register("name")}
            className="w-full border p-2 rounded mb-1"
            placeholder="Enter category"
          />

          <p className="text-red-500 text-sm mb-3">
            {errors.name?.message}
          </p>

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