import React, { useState, useEffect } from "react";
import { Package, Truck, CreditCard, MapPin, Tag } from "lucide-react";
import { useParams } from "react-router";
import {
  useChangeOrderStatusMutation,
  useGetAOrderQuery,
} from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast";

const OrderDetails = () => {
  const { id: orderId } = useParams();

  // Fetch order data
  const { data, isLoading, refetch } = useGetAOrderQuery({ orderId });
  const [changeStatus] = useChangeOrderStatusMutation();

  // Status options for product status dropdown
  const statusOptions = [
    "Order placed",
    "Processing",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

    const paymentStatusOptions = ["Pending", "Success", "Refunded"];

  // Function to update product status
  const updateProductStatus = async (newStatus) => {
    try {
      await changeStatus({ newStatus, orderId }).unwrap();
      successToast("Product status changed");
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "Error while updating order status"
      );
      console.log(error);
    }
  };


  const updatePaymentStatus = async (newPaymentStatus) => {

    try {

      await changeStatus({ newPaymentStatus, orderId }).unwrap();
      successToast("Product status changed");
    } catch (error) {
      errorToast(
        error?.message ||
          error?.data?.message ||
          "Error while updating order status"
      );
      console.log(error);
    }
  }


  

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
    <div className="pt-40">
      <div className="max-w-4xl  mx-auto  bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Order Header */}
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Order {data.orderNumber}
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.paymentStatus === "Success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.paymentStatus}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Shipping Address */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <MapPin className="mr-2 text-blue-600" /> Shipping Address
            </h3>
            <p>{data.shippingAddress.name}</p>
            <p>{data.shippingAddress.street}</p>
            <p>
              {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
              {data.shippingAddress.zip}
            </p>
            <p>{data.shippingAddress.country}</p>
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="text-blue-600" />
              <span className="font-semibold">
                Shipping: {data.shipping.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="text-blue-600" />
              <span>{data.paymentMethod}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="text-blue-600" />
              <span>Coupon: {data.couponCode || "No coupon applied"}</span>
            </div>
          </div>
        </div>

        {/* Billing Details */}
        {/* <div className="bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Billing Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${data?.pricing?.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span>${data?.pricing?.shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${data?.pricing?.tax.toFixed(2)}</span>
          </div>
          {data?.pricing?.couponDiscount < 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>
                -${Math.abs(data?.pricing?.couponDiscount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>${data?.pricing?.total.toFixed(2)}</span>
          </div>
        </div>
      </div> */}

        {/* Product List */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Order Item</h3>

          <div
            key={data.productId}
            className="flex items-center space-x-4 py-4 border-b last:border-b-0"
          >
            <img
              src={data.imageUrl}
              alt={data.name}
              className="w-20 h-20 object-contain rounded-md"
            />
            <div className="flex-grow">
              <h4 className="font-medium">{data.name}</h4>
              <p className="text-gray-600 text-sm">Model: {data.model}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span>Status:</span>
                <select
                  value={data.status}
                  onChange={(e) => updateProductStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span>Payement Status:</span>
                <select
                  value={data.paymentStatus}
                  onChange={(e) => updatePaymentStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {paymentStatusOptions.filter((status) => (
                    status !== 'Refunded' || data.status === 'Cancelled' || data.status === 'Returned'
                  )).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${data.price.toFixed(2)}</p>
              <p className="text-gray-600">Qty: {data.quantity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
