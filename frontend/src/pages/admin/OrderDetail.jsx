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
  const { data, isLoading } = useGetAOrderQuery({ orderId });
  const [changeStatus] = useChangeOrderStatusMutation();

  const statusOptions = [
    "Order placed",
    "Processing",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const paymentStatusOptions = ["Pending", "Successful", "Refunded"];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({
    orderStatus: "",
    paymentStatus: "",
  });

  const updateStatus = async (orderStatus, paymentStatus) => {
    try {
      await changeStatus({
        orderId,
        newStatus: orderStatus,
        newPaymentStatus: paymentStatus,
      }).unwrap();
      successToast("Status updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      errorToast(error?.data?.message || "Error updating status");
    }
  };

  const handleStatusChange = (newOrderStatus) => {
    let newPaymentStatus = data.paymentStatus;

    if (newOrderStatus === "Cancelled" || newOrderStatus === "Returned") {
      setSelectedStatus({
        orderStatus: newOrderStatus,
        paymentStatus: "Refunded",
      });
      setIsModalVisible(true);
      return;
    }

    updateStatus(newOrderStatus, newPaymentStatus);
  };

  const handlePaymentStatusChange = (newPaymentStatus) => {
    updateStatus(data.status, newPaymentStatus);
  };

  const handleModalConfirm = () => {
    updateStatus(selectedStatus.orderStatus, selectedStatus.paymentStatus);
  };

  const isStatusDisabled =
    data?.status === "Cancelled" || data?.status === "Returned";
  const isPaymentDisabled = data?.paymentStatus === "Refunded";

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeWidth="2"
          animationDuration="8"
        />
      </div>
    );
  }

  return (
    <div className="pt-40">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
              data.paymentStatus === "Successful"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {data.paymentStatus}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
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

        {/* Product List */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Order Item</h3>
          <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
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
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  disabled={isStatusDisabled}
                >
                  {statusOptions
                    .filter(
                      (status) =>
                        !status.includes("Returned") || data.returnPolicy
                    )
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span>Payment Status:</span>
                <select
                  value={data.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  disabled={isPaymentDisabled}
                >
                  {paymentStatusOptions.map((status) => (
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

      {/* Confirmation Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold">Confirm Action</h3>
            <p className="mt-4">
              This will change the order status to {selectedStatus.orderStatus}{" "}
              and payment status to {selectedStatus.paymentStatus}. Continue?
            </p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
