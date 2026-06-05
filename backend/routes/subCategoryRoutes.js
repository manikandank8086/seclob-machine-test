import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getByCategory,
} from "../controllers/subCategoryControlle.js";

const router = express.Router();

router.post("/create", createSubCategory);
router.get("/", getAllSubCategories);
router.get("/:categoryId", getByCategory);

export default router;