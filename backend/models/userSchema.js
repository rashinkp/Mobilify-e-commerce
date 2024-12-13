import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
    },
    otpId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    addresses: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: mongoose.Types.ObjectId,
        },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
        label: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


})



userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}


const User = mongoose.model('User', userSchema);

export default User