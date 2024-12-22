import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponId: {
    type: String, // Unique identifier for the coupon
    required: true, // Field is required
    unique: true, // Ensure no duplicates
    trim: true, // Removes leading/trailing spaces
  },
  title: {
    type: String, // Title of the coupon
    required: true, // Field is required
    trim: true, // Removes leading/trailing spaces
  },
  description: {
    type: String, // Description of the coupon
    trim: true, // Optional, but trimmed
  },
  discount: {
    type: Number, // Discount percentage or amount
    required: true, // Field is required
    min: 0, // Minimum discount value
  },
  expiryDate: {
    type: Date, // Expiration date of the coupon
    required: true, // Field is required
  },
  applicables: {
    type: [String], // Array of category IDs where the coupon can be applied
    default: [], // Default is an empty array
  },
  usersTaken: {
    type: [String], // Array of user IDs who have taken the coupon
    default: [], // Default is an empty array
  },
  createdAt: {
    type: Date, // When the coupon was created
    default: Date.now, // Default value is the current date
    immutable: true, // Prevents updates to this field
  },
  updatedAt: {
    type: Date, // When the coupon was last updated
    default: Date.now, // Default value is the current date
  },
  isSoftDeleted: {
    type: Boolean,
    default: false,
  },
});



couponSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
