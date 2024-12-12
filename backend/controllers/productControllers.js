import asyncHandler from 'express-async-handler'
import Product from '../models/productSchema.js'
import cloudinary from '../config/cloudinary.js'


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
})


export const getAllProducts = asyncHandler(async (req, res) => {
  const { all } = req.query;

  const filter = all ? {} : { isSoftDelete: false };

  try {
    const products = await Product.find(filter);

    if (products.length > 0) {
      res.status(200).json(products); 
    } else {
      res.status(404).json({ message: "Couldn't find any products" }); 
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
    res.status(200).json(product)
  } else {
    res.status(404).json({ message: 'Couldn"t find any product with the id' });
  }
})


export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (deletedProduct) {
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({message:'product not found'})
  }
})


export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;


  const product = await Product.findById(productId);
  if (product) {
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
})



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
