import asyncHandler from 'express-async-handler'
import Order from '../models/orderSchema.js';


export const addOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const data = req.body;

  if (!userId || !data) {
    res.status(400).json({message:'did not get required input, please try again'})
  }
  
  data.user = userId;

  const order = new Order(data);
  const saveOrder = await order.save();

  res.status(201).json({
    message: 'Order place successfully',
    order: saveOrder,
  })

})