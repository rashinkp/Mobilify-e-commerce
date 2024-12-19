import asyncHandler from "express-async-handler";
import Product from "../models/productSchema.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const addProduct = asyncHandler(async (req, res) => {
  const product = req.body;
  const addedProduct = await Product.create(product);
  if (addedProduct) {
    res.status(201).json(addedProduct);
  } else {
    res.status(400);
    console.log("Invalid product data");
    throw new Error("Invalid product data");
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    filterBy = "All",
    searchTerm = "",
  } = req.query;

  const skip = (page - 1) * limit;

  let filter = {};

  if (filterBy === "active") {
    filter = { isSoftDelete: false };
  } else if (filterBy === "inactive") {
    filter = {isSoftDelete: true};
  } else if (filterBy === "low stock") {
    filter = { stock: { $lt: 20 } };
  } else if (filterBy === "high stock") {
    filter = { stock: { $gt: 20 } };
  }

  if (searchTerm.trim() !== "") {
    filter.name = { $regex: searchTerm, $options: "i" };
  }

  try {
    const products = await Product.find(filter)
      .collation({ locale: "en", strength: 2 })
      .sort({
        [sortBy]: order === "desc" ? -1 : 1,
      })
      .skip(Number(skip))
      .limit(Number(limit));

    const totalCount = await Product.countDocuments(filter);

    if (products.length > 0) {
      res.status(200).json({ products, totalCount });
    }

    if (!products || products.length === 0) {
      return res.status(200).json({
        products: [],
        totalCount: 0,
        message: "No products found for the selected filters.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Couldn"t find any product with the id' });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (deletedProduct) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "product not found" });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        if (key === "categoryId" && mongoose.isValidObjectId(updateData[key])) {
          // Convert categoryId to ObjectId
          product[key] = new mongoose.Types.ObjectId(updateData[key]);
        } else {
          product[key] = updateData[key];
        }
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export const updateImages = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { uploadedUrl: images, deleteQueue } = req.body;

  if (!Array.isArray(images)) {
    return res
      .status(400)
      .json({ error: "Invalid data format. Expected an array of images." });
  }

  try {
    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle the delete queue
    if (deleteQueue && Array.isArray(deleteQueue)) {
      for (const index of deleteQueue) {
        const imageToDelete = product.images[index];
        if (imageToDelete) {
          // Delete the image from Cloudinary
          const publicId = imageToDelete.public_id;
          await cloudinary.uploader.destroy(publicId);

          // Remove the image from the product
          product.images.splice(index, 1);
        }
      }
    }

    // Add new images
    product.images.push(...images);

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Images updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while updating the product images",
      details: error.message,
    });
  }
});
