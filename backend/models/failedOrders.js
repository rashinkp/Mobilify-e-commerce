import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    returnPolicy: {
      type: Boolean,
      required: true,
    },

    couponApplied: {
      type: {
        couponCode: { type: String, trim: true },
        offerAmount: { type: Number, default: 0 },
      },
      default: null,
      _id: false,
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => {
        return `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 5)
          .toUpperCase()}`;
      },
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, trim: true },

    status: {
      type: String,
      default: "Pending",
    },

    offerPrice: {
      type: Number,
    },

    shipping: {
      id: { type: String, required: true },
      name: {
        type: String,
        enum: [
          "Standard Shipping",
          "Express Shipping",
          "Next Day Delivery",
          "International Shipping",
        ],
        required: true,
      },
      time: { type: String, required: true },
      trackingNumber: { type: String, trim: true },
    },

    paymentMethod: {
      type: String,
      required: true,
      default: "Razorpay",
    },

    paymentStatus: {
      type: String,
      default: "Failed",
    },

    shippingAddress: {
      addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
      label: { type: String, trim: true },
    },

    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const FailedOrder = mongoose.model("FailedOrder", OrderSchema);

export default FailedOrder;
