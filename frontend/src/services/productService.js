import api from "./api";

export const createProduct = async (data) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("subCategory", data.subCategory);
  formData.append("description", data.description);

  // IMPORTANT: variants must be stringified
  formData.append("variants", JSON.stringify(data.variants));

  // files
  if (data.files && data.files.length > 0) {
    Array.from(data.files).forEach((file) => {
      formData.append("files", file);
    });
  }

  return await api.post("/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



export const updateProduct = (id, data) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("subCategory", data.subCategory);

  formData.append(
    "variants",
    JSON.stringify(data.variants)
  );

  if (data.files?.length) {
    Array.from(data.files).forEach((file) => {
      formData.append("files", file);
    });
  }

  return api.put(`/products/${id}`, formData);
};