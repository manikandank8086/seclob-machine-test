import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getByCategory,
} from "../controllers/subCategoryControlle.js";

const router = express.Router();

router.post("/create", createSubCategory);
router.get("/", getSubCategories);
router.get("/:categoryId", getByCategory);

export default router;