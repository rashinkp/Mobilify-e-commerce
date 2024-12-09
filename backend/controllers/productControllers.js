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