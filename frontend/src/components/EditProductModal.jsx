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

            <div className="bg-white w-full max-w-4xl rounded-xl p-6 overflow-y-auto max-h-[90vh]">

                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-2xl font-semibold text-center mb-5">
                    Edit Product
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* TITLE */}
                    <div className="flex items-center gap-4">
                        <label className="w-28">Title :</label>

                        <div className="flex-1">
                            <input
                                {...register("title")}
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <p className="text-red-500 text-sm">
                                {errors.title?.message}
                            </p>
                        </div>
                    </div>

                    {/* VARIANTS */}
                    <div className="flex gap-4">
                        <label className="w-28">Variants :</label>

                        <div className="flex-1 space-y-2">

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-3 gap-2"
                                >
                                    <input
                                        {...register(
                                            `variants.${index}.ram`
                                        )}
                                        className="border rounded px-2 py-2"
                                    />

                                    <input
                                        {...register(
                                            `variants.${index}.price`
                                        )}
                                        className="border rounded px-2 py-2"
                                    />

                                    <input
                                        type="number"
                                        {...register(
                                            `variants.${index}.qty`
                                        )}
                                        className="border rounded px-2 py-2"
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        ram: "",
                                        price: "",
                                        qty: 1,
                                    })
                                }
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                Add Variant
                            </button>
                        </div>
                    </div>

                    {/* SUB CATEGORY */}
                    <div className="flex gap-4">
                        <label className="w-28">
                            Sub Category :
                        </label>

                        <div className="relative flex-1">

                            <div
                                onClick={() =>
                                    setDropDownOpen(!dropdownOpen)
                                }
                                className="border rounded-lg px-3 py-2 cursor-pointer"
                            >
                                {selected || "Select Sub Category"}
                            </div>

                            {dropdownOpen && (
                                <div className="absolute bg-white border rounded-lg mt-1 w-full z-50">

                                    {subCategories.map((item) => (
                                        <div
                                            key={item._id}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
                    <div className="flex gap-4">
                        <label className="w-28">
                            Description :
                        </label>

                        <div className="flex-1">
                            <textarea
                                rows={3}
                                {...register("description")}
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <p className="text-red-500 text-sm">
                                {errors.description?.message}
                            </p>
                        </div>
                    </div>

                    {/* IMAGES */}
                    <div className="flex gap-4">
                        <label className="w-28">Images :</label>

                        <div className="flex gap-3">

                            {product?.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={`http://localhost:5000${img}`}
                                    alt=""
                                    className="w-20 h-20 border rounded object-cover"
                                />
                            ))}

                            {previews.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    className="w-20 h-20 border rounded object-cover"
                                />
                            ))}

                            <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                                +
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

                    <div className="flex justify-end gap-3">

                        <button
                            type="submit"
                            className="bg-[#EDA415] text-white px-5 py-2 rounded-lg"
                        >
                            UPDATE
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 px-5 py-2 rounded-lg"
                        >
                            CANCEL
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}