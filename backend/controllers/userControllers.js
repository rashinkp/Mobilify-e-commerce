import asyncHandler from 'express-async-handler'
import User from '../models/userSchema';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  
})