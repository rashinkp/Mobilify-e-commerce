import Admin from "../models/adminSchema.js";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from 'express-async-handler'

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    console.log("Admin already exists");
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    generateToken(res, admin._id, "admin");
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(400);
    console.log("Invalid admin data");
    throw new Error("Invalid admin data");
  }
});


export const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    generateToken(res, admin._id, "admin");
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


export const logoutAdmin = asyncHandler(async (req, res) => {
  try {
    // Clear the admin cookie
    res.cookie("admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    // Send a success response
    res.status(200).json({ message: "Admin Logout" });
  } catch (error) {

    console.error("Error during admin logout:", error);
    throw new Error("Failed to log out admin");
    
  }
});


export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({message:'Can not find any users'})
    }

  } catch (err) {
    // throw new Error("Failed to fetch users data");
    res.status(400).json({ message: 'error while fetching user data' })
  }
})



export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findByIdAndDelete( userId );
    if (user) {
      res.status(200).json({message:'User deleted Successfully'})
    } else {
       res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
})
