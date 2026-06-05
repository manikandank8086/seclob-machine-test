import * as yup from "yup";

export const subCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Subcategory name is required")
    .min(2, "Subcategory must be at least 2 characters")
    .max(50, "Subcategory too long"),

  categoryId: yup
    .string()
    .required("Please select a category"),
});