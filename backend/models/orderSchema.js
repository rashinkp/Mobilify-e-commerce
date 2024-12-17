import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
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

    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
      label: { type: String, trim: true },
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Payment Method
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

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      shippingCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      tax: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
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
      trackingNumber: {
        type: String,
        trim: true,
      },
    },

    // Order Status
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Pending",
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    expectedDeliveryDate: {
      type: Date,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrderSchema.index({ user: 1, orderDate: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;
