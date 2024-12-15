import asyncHandler from "express-async-handler";
import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js"; 
import mongoose from "mongoose";

export const addToCart = asyncHandler(async (req, res) => {
  const {userId} = req.user
  const { productId, quantity } = req.body;

  // Validate the inputs
  if (!productId || !quantity || quantity < 1) {
    res.status(400);
    throw new Error("Invalid product ID or quantity");
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the user already has a cart
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // If no cart exists, create a new one
    cart = new Cart({
      userId,
      cartItems: [{ productId, quantity }],
    });
  } else {
    // If cart exists, check if product is already in the cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // If product exists in cart, update the quantity
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.cartItems.push({ productId, quantity });
    }
  }

  await cart.save();

  res.status(200).json({
    message: "Product added to cart successfully",
    cart,
  });
});




export const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const userObjectId = new mongoose.Types.ObjectId(userId)

  let cart = await Cart.aggregate([
    //finding the user
    { $match: { userId: userObjectId } },

    //unwind cart items to process each
    { $unwind: { path: "$cartItems", preserveNullAndEmptyArrays: true } },

    //lookup product details for each productId
    {
      $lookup: {
        from: "products",
        localField: "cartItems.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },

    //add product details directly to cartItems
    {
      $addFields: {
        "cartItems.productDetails": { $arrayElemAt: ["$productDetails", 0] },
      },
    },

    //grouping again
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        cartItems: { $push: "$cartItems" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ]);

  if (!cart || cart.length === 0) {
    const newCart = new Cart({
      userId,
      cartItems: [],
    });
    await newCart.save();
    return res.status(200).json(newCart)
  }

  res.status(200).json(cart[0]);
});
