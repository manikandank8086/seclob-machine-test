import * as yup from "yup";

/* ---------------- FILE RULES ---------------- */
const FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILES = 2;

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ---------------- HELPERS ---------------- */
const getFiles = (value) => {
  if (!value) return [];
  if (value instanceof FileList) return Array.from(value);
  if (Array.isArray(value)) return value;
  return [];
};

/* ---------------- MAIN SCHEMA ---------------- */
export const createProductSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  subCategory: yup
    .string()
    .required("Sub category is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum 10 characters required"),

  /* ---------------- VARIANTS ---------------- */
  variants: yup.array().of(
    yup.object().shape({
      ram: yup.string().required("RAM is required"),

      price: yup
        .string()
        .required("Price is required")
        .matches(/^\$?\d+(\.\d{1,2})?$/, "Invalid price format"),

      qty: yup
        .number()
        .typeError("Qty must be a number")
        .min(0, "Qty cannot be negative")
        .required("Qty is required"),
    })
  ),

  /* ---------------- FILE VALIDATION ---------------- */
  files: yup
    .mixed()
    .required("At least 1 image is required")

    // must exist
    .test("file-exist", "Please upload at least 1 image", (value) => {
      return getFiles(value).length > 0;
    })

    // max file count
    .test("max-files", "Maximum 2 images allowed", (value) => {
      return getFiles(value).length <= MAX_FILES;
    })

    // file size
    .test("file-size", "Each image must be under 2MB", (value) => {
      return getFiles(value).every((file) => file.size <= FILE_SIZE);
    })

    // file type
    .test("file-type", "Only JPG, PNG, WEBP allowed", (value) => {
      return getFiles(value).every((file) =>
        SUPPORTED_FORMATS.includes(file.type)
      );
    }),
});



export const editProductSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  subCategory: yup
    .string()
    .required("Sub category is required"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum 10 characters required"),

  variants: yup.array().of(
    yup.object().shape({
      ram: yup.string().required("RAM is required"),

      price: yup
        .string()
        .required("Price is required")
        .matches(
          /^\$?\d+(\.\d{1,2})?$/,
          "Invalid price format"
        ),

      qty: yup
        .number()
        .typeError("Qty must be a number")
        .min(0, "Qty cannot be negative")
        .required("Qty is required"),
    })
  ),

  files: yup.mixed().nullable(),
});