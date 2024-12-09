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