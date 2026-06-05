import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      subCategory,
      categoryId,
      subCategoryId,
      description,
      variants,
    } = req.body;

    const images = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const product = await Product.create({
      title,
      subCategory, // keep old working field (DO NOT REMOVE)

      // NEW FIELDS (SAFE ADDITION)
      categoryId,
      subCategoryId,

      description,
      variants: JSON.parse(variants),
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {

    console.log('fetch productdddd')
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const toggleWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.wishlist = !product.wishlist;

    await product.save();

    res.status(200).json({
      success: true,
      wishlist: product.wishlist,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlistProducts = async (req, res) => {
  try {
    console.log("Wishlist API called");

    const wishlistProducts = await Product.find({
      wishlist: true,
    });

    console.log(wishlistProducts);

    res.status(200).json({
      success: true,
      data: wishlistProducts,
    });
  } catch (error) {
    console.log("Wishlist Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






export const updateProduct = async (req, res) => {
  console.log('working update function')
  try {
    const { id } = req.params;

    const {
      title,
      description,
      subCategory,
      variants,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let imagePaths = product.images;

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        subCategory,
        variants: JSON.parse(variants),
        images: imagePaths,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
