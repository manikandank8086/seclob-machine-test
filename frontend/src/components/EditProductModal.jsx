import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProductSchema } from "../validation/productSchema";
import { updateProduct } from "../services/productService";
import { toast } from "react-toastify";
import api from "../services/api";

export default function EditProductModal({
    open,
    onClose,
    product,
    onProductUpdated,
}) {
    const [subCategories, setSubCategories] = useState([]);
    const [selected, setSelected] = useState("");
    const [dropdownOpen, setDropDownOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(editProductSchema),
        defaultValues: {
            title: "",
            subCategory: "",
            description: "",
            variants: [],
        },
    });

    const { fields, append, replace } = useFieldArray({
        control,
        name: "variants",
    });

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const res = await api.get("/subcategories");
                setSubCategories(res.data?.data || []);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSubCategories();
    }, []);

    useEffect(() => {
        if (!product) return;

        reset({
            title: product.title || "",
            description: product.description || "",
            subCategory: product.subCategory || "",
            variants:
                product.variants?.map((v) => ({
                    ram: v.ram,
                    price: v.price,
                    qty: v.qty,
                })) || [],
        });

        replace(
            product.variants?.map((v) => ({
                ram: v.ram,
                price: v.price,
                qty: v.qty,
            })) || []
        );

        setSelected(product.subCategory || "");
    }, [product, reset, replace]);

    const files = watch("files");

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (!files?.length) {
            setPreviews([]);
            return;
        }

        const urls = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    const onSubmit = async (data) => {
        try {
            const res = await updateProduct(product._id, data);

            toast.success("Product updated successfully");
            onProductUpdated(res.data.data);

            onClose();
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update product"
            );
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-xl p-5 sm:p-6 overflow-y-auto max-h-[90vh] shadow-2xl relative">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-black transition"
                >
                    ×
                </button>

                <h2 className="text-2xl font-semibold text-center mb-5 text-[#003B5C]">
                    Edit Product
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* TITLE */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Title :</label>

                        <div className="flex-1 w-full">
                            <input
                                {...register("title")}
                                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-[#EDA415] outline-none transition"
                            />

                            <p className="text-red-500 text-sm mt-0.5">
                                {errors.title?.message}
                            </p>
                        </div>
                    </div>

                    {/* VARIANTS */}
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base sm:pt-2">Variants :</label>

                        <div className="flex-1 w-full space-y-2">
                            <div className="grid grid-cols-3 text-xs sm:text-sm text-gray-400 mb-1 px-2">
                                <span>Ram</span>
                                <span>Price</span>
                                <span>QTY</span>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-gray-50 border rounded-lg px-2 py-2 items-center"
                                >
                                    <input
                                        {...register(
                                            `variants.${index}.ram`
                                        )}
                                        className="border rounded px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                                    />

                                    <input
                                        {...register(
                                            `variants.${index}.price`
                                        )}
                                        className="border rounded px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                                    />

                                    <input
                                        type="number"
                                        {...register(
                                            `variants.${index}.qty`
                                        )}
                                        className="border rounded px-1.5 sm:px-2 py-1 text-xs sm:text-sm w-full outline-none focus:border-[#EDA415]"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            ram: "",
                                            price: "",
                                            qty: 1,
                                        })
                                    }
                                    className="bg-gray-800 hover:bg-gray-700 transition text-white px-3 py-1 rounded-lg text-xs sm:text-sm"
                                >
                                    Add Variant
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SUB CATEGORY */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">
                            Sub Category :
                        </label>

                        <div className="relative flex-1 w-full">
                            <div
                                onClick={() =>
                                    setDropDownOpen(!dropdownOpen)
                                }
                                className="border rounded-lg px-3 py-2 cursor-pointer bg-white text-sm sm:text-base flex justify-between items-center outline-none focus:border-[#EDA415]"
                            >
                                <span>{selected || "Select Sub Category"}</span>
                                <span className="text-gray-400 text-xs">▼</span>
                            </div>

                            {dropdownOpen && (
                                <div className="absolute bg-white border rounded-lg mt-1 w-full z-50 shadow-lg max-h-48 overflow-y-auto">
                                    {subCategories.map((item) => (
                                        <div
                                            key={item._id}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                                            onClick={() => {
                                                setSelected(item.name);
                                                setValue(
                                                    "subCategory",
                                                    item.name
                                                );
                                                setDropDownOpen(false);
                                            }}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">
                            Description :
                        </label>

                        <div className="flex-1 w-full">
                            <textarea
                                rows={3}
                                {...register("description")}
                                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:border-[#EDA415] outline-none transition"
                            />

                            <p className="text-red-500 text-sm mt-0.5">
                                {errors.description?.message}
                            </p>
                        </div>
                    </div>

                    {/* IMAGES */}
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <label className="w-full sm:w-28 text-gray-500 font-medium sm:font-normal text-sm sm:text-base">Images :</label>

                        <div className="flex-1 w-full">
                            <div className="flex flex-wrap gap-3">
                                {product?.images?.map((img, i) => (
                                    <img
                                        key={i}
                                        src={`http://localhost:5000${img}`}
                                        alt=""
                                        className="w-20 h-20 border rounded object-cover bg-gray-50"
                                    />
                                ))}

                                {previews.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt=""
                                        className="w-20 h-20 border rounded object-cover bg-gray-50"
                                    />
                                ))}

                                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-400">
                                    <span className="text-2xl font-light">+</span>
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        accept="image/*"
                                        {...register("files")}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 transition px-5 py-2 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
                        >
                            CANCEL
                        </button>

                        <button
                            type="submit"
                            className="bg-[#EDA415] hover:bg-[#D8940D] transition text-white px-5 py-2 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
                        >
                            UPDATE
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}