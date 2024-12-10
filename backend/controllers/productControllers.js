import asyncHandler from 'express-async-handler'
import Product from '../models/productSchema.js'



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
  const products = await Product.find({});
  if (products) {
    res.status(201).json(products);
  } else {
    res.status(404).json({message:'Couldn"t find any products'})
  }
})


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
  const images = req.body; 



  if (images.length < 1) {
    throw new Error("Please select atleast 1 image");
  }

  if (!Array.isArray(images)) {
    return res
      .status(400)
      .json({ error: "Invalid data format. Expected an array of images." });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: { $each: images } } }, 
      { new: true } 
    );

    console.log(updatedProduct)

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Images added successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "An error occurred while updating the product images",
      details: error.message,
    });
  }
});
