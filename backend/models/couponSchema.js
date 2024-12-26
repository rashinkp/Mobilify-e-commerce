import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  minAmount: {
    type: Number,
    default:100
  },
  maxAmount: {
    type: Number,
    default:10000
  },
  description: {
    type: String,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  applicables: {
    type: [String],
    default: [],
  },
  usersTaken: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isSoftDeleted: {
    type: Boolean,
    default: false,
  },
});

// Virtual field for expiry status
couponSchema.virtual("isExpired").get(function () {
  return this.expiryDate < Date.now();
});

// Middleware to update the updatedAt field
couponSchema.pre("save", function (next) {
  if (this.expiryDate < Date.now()) {
    return next(new Error("Cannot save or update an expired coupon."));
  }
  this.updatedAt = Date.now();
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
