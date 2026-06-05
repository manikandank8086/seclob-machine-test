import express from "express";
import { createProduct, getProductById, getProducts, getWishlistProducts, toggleWishlist, updateProduct } from "../controllers/productController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* create product with 2 images max */
router.post(
  "/create",
  upload.array("files", 2),
  createProduct
);

router.get("/", getProducts);
router.get("/wishlist", getWishlistProducts);
router.get("/:id", getProductById);

router.patch("/wishlist/:id", toggleWishlist);
router.put(
  "/:id",
  upload.array("files", 2),
  updateProduct
);


export default router;