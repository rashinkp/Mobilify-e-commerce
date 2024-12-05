import Admin from "../models/adminSchema.js";
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

