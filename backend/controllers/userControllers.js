import asyncHandler from 'express-async-handler'
import User from '../models/userSchema.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    console.log('User already exists')
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id, 'user');
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
     res.status(400);
     console.log("Invalid user data");
     throw new Error("Invalid user data");
  }
})


export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id, "user");
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    console.log("Invalid user name or password");
    throw new Error("Invalid user name or password");
  }
})


export const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie('user', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    res.status(200).json({message:'User Logout Successful'})
  } catch (err) {
      console.error("Error during admin logout:", error);

      throw new Error("Failed to log out admin");
  }
})