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
      enum: [
        "Pending",
        "Order placed",
        "Processing",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Order placed",
    },

    paymentId: {
      type: String,
      ref: "Payment",
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
      enum: [
        "Credit Card",
        "PayPal",
        "Razorpay",
        "Google Pay",
        "Cash On Delivery",
        "Bank Transfer",
        "Wallet",
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Successful", "Refunded"],
      default: "Pending",
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
    deliveryDate: { type: Date },
    returnWithinDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ userId: 1, orderDate: -1 });

const Order = mongoose.model("Order", OrderSchema);

export default Order;
