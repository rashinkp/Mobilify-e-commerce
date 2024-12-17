import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        "Apple Pay",
        "Google Pay",
        "Cash on Delivery",
        "Bank Transfer",
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Refunded"],
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
    expectedDeliveryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ userId: 1, orderDate: -1 });

const Order = mongoose.model("Order", OrderSchema);

export default Order;