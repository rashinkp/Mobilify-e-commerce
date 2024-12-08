import asyncHandler from "express-async-handler";
import Category from "../models/categorySchema.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    console.log("category already exists");
    throw new Error("category already exists");
  }

  const category = await Category.create({
    name,
    description,
  });

  if (category) {
    res.status(201).json({
      _id: category._id,
      name: category.name,
      description: category.description,
    });
  } else {
    res.status(400);
    console.log("Invalid category data");
    throw new Error("Invalid category data");
  }
});

export const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(404).json({ message: "Couldnt find any categories " });
  }
});

//delete category

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndDelete(categoryId);

  if (category) {
    res.status(200).json({ message: "category deleted successfully" });
  } else {
    res.status(404).json({ message: "category not found" });
  }
});

//update category

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name, description,isSoftDeleted } = req.body;

  const category = await Category.findById(categoryId);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;
    if (isSoftDeleted !== undefined) {
      category.isSoftDeleted = isSoftDeleted;
    }


    const updatedCategory = await category.save();
    res.status(200).json({
      id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
    });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
