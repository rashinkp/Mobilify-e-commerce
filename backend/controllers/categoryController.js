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
    res.status(200).json(categories)
  } else {
    res.status(404).json({message:'Couldnt find any categories '})
  }
})
