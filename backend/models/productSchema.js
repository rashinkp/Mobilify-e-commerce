import mongoose  from "mongoose";


const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
    },
    offerPercent: { type: Number, required: true },
    images: { type: [Object], required: false },
    returnPolicy: { type: Boolean, default:true },
    COD: { type: Boolean, default: true },
    warranty: { type: String, required: true },
    isSoftDelete: { type: Boolean, default: false },
    model: { type: String, required: true },
    size: { type: String, required: true },
    ram: { type: Number, required: true },
    storage: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    network: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", ProductSchema);
export default Product;