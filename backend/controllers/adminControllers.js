import Admin from "../models/adminSchema.js";
import Brand from "../models/brandSchema.js";
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






export const blockUser = asyncHandler(async (req, res) => {
  const  userId  = req.params.id;
  console.log(userId)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newStatus = !user.isBlocked;
    await User.updateOne({ _id: userId }, { $set: { isBlocked: newStatus } });
    return res
      .status(200)
      .json({
        message: `User status updated to ${
          newStatus ? "blocked" : "active"
        } successfully`,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});


export const addBrand = asyncHandler(async (req, res) => {
  const { name, description, website } = req.body;

   const brandExists = await Brand.findOne({ name });
   if (brandExists) {
     res.status(400);
     console.log("Brand already exists");
     throw new Error("Brand already exists");
  }
  
  const brand = await Brand.create({
    name,
    description,
    website,
  })

  if (brand) {
    res.status(201).json({
      _id: brand._id,
      name: brand.name,
      description: brand.description,
    });
  } else {
     res.status(400);
     console.log("Invalid brand data");
     throw new Error("Invalid brand data");
  }
})



export const getAllBrand = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  if (brands) {
    res.status(200).json(brands)
  } else {
    res.status(404).json({message:'Couldnt find any brands'})
  }
})


export const deleteBrand = asyncHandler(async (req, res) => {
  const brandId = req.params.id;
  const brand = await Brand.findById(brandId);

  if (!brand) {
    return res.status(404).json({ message: "Brand not found" });
  }


  brand.isSoftDeleted = !brand.isSoftDeleted;

  const updatedBrand = await brand.save();

  if (updatedBrand) {
    res.status(200).json({message:'Brand deleted successfully'})
  } else {
    res.status(404).json({message:'Brand not found'})
  }
})


export const getAdminData = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  
  const admin = await Admin.findById(userId);

  if (!admin) {
    return res.status(404).json({ message: 'No such admin found' });
  }

  res.status(200).json(admin);
})