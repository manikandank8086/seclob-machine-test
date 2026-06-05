import SubCategory from "../models/SubCategory.js";

/* CREATE SUBCATEGORY */
export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const subCategory = await SubCategory.create({
      name,
      categoryId,
    });

    res.status(201).json({
      success: true,
      message: "Sub category created",
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL SUBCATEGORIES */
export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET SUBCATEGORIES BY CATEGORY */
export const getByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const data = await SubCategory.find({ categoryId });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};