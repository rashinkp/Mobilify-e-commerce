import mongoose  from "mongoose";

const CapacitySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  RAM: { type: String, required: true },
  stock: { type: Number, required: true },
  Storage: { type: String, required: true },
});

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
    image: { type: [String], required: false },
    returnPolicy: { type: String, required: true },
    COD: { type: Boolean, default: true },
    warranty: { type: String, required: true },
    isSoftDelete: { type: Boolean, default: false },
    isArchieved: { type: Boolean, default: false },
    model: { type: String, required: true },
    size: { type:String, required: true },
    network: { type: String, required: true },
    Capacity: { type: [CapacitySchema], required: false },
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