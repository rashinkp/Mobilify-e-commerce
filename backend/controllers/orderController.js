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
    orderId: saveOrder._id,
  })

})

export const getOrder = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { id:orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(200).json(order)

})