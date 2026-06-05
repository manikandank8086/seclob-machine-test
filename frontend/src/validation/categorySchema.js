import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category too long"),
});