import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required:true,
  },

}, {
  timestamps:true,
})