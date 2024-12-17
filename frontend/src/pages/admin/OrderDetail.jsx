import React, { useState } from "react";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useParams } from "react-router";
import { useGetAOrderQuery } from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";

const OrderDetails = () => {

  const { id: orderId } = useParams();

  const { data, isLoading, isError, error, refetch } = useGetAOrderQuery({ orderId })
  
  const order = data || {};


  // Status options for product status dropdown
  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  // Function to update product status
  const updateProductStatus = (productId, newStatus) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: prevOrder.products.map((product) =>
        product.id === productId ? { ...product, status: newStatus } : product
      ),
    }));
  };


   if (isLoading) {
     return (
       <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
         <RotatingLines
           visible={true}
           height="50"
           width="50"
           color="grey"
           strokeColor="#fff"
           strokeWidth="2"
           animationDuration="8"
           ariaLabel="rotating-lines-loading"
         />
       </div>
     );
   }

  return (
    <div className="max-w-4xl  mx-auto  bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Order {order.orderId}
          </h2>
        </div>
        <span
          className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${
            order.paymentStatus === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        `}
        >
          {order.paymentStatus}
        </span>
      </div>

      {/* Order Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Shipping Address */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 flex items-center">
            <MapPin className="mr-2 text-blue-600" /> Shipping Address
          </h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zip}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Truck className="text-blue-600" />
            <span className="font-semibold">
              Shipping: {order.shippingType}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="text-blue-600" />
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="text-blue-600" />
            <span>Coupon: {order.couponCode || "No coupon applied"}</span>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Billing Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order?.pricing?.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span>${order?.pricing?.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order?.pricing?.tax.toFixed(2)}</span>
          </div>
          {order?.pricing?.couponDiscount < 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>
                -${Math.abs(order?.pricing?.couponDiscount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>${order?.pricing?.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
        {order.orderItems.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 py-4 border-b last:border-b-0"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-contain rounded-md"
            />
            <div className="flex-grow">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-gray-600 text-sm">Model: {product.model}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span>Status:</span>
                <select
                  value={product.status}
                  onChange={(e) =>
                    updateProductStatus(product.id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${product.price.toFixed(2)}</p>
              <p className="text-gray-600">Qty: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
