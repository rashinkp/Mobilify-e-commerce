import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Tag,
  Home,
  ChevronRight,
  ShoppingCart,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Link, useParams } from "react-router";
import {
  useChangeOrderStatusMutation,
  useGetAOrderQuery,
} from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { errorToast, successToast } from "../../components/toast";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const { data = {}, isLoading } = useGetAOrderQuery({ orderId });
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

  const conditionMet =
    data?.status === "Cancelled" || data?.status === "Returned";

  const paymentStatusOptions = ["Pending", "Successful", "Refunded"].filter(
    (status) => (status === "Refunded" ? conditionMet : true)
  );

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
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
      setOrderModalVisible(false);
      setPaymentModalVisible(false);
    } catch (error) {
      errorToast(error?.data?.message || "Error updating status");
    }
  };

  const handleStatusChange = (newOrderStatus) => {
    if (newOrderStatus === "Cancelled" || newOrderStatus === "Returned") {
      setSelectedStatus({
        orderStatus: newOrderStatus,
      });
      setOrderModalVisible(true);
      return;
    }
    updateStatus(newOrderStatus, data.paymentStatus);
  };

  const handlePaymentStatusChange = (newPaymentStatus) => {
    setSelectedStatus({
      orderStatus: data.status,
      paymentStatus: newPaymentStatus,
    });
    setPaymentModalVisible(true);
  };

  console.log(data);
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
    <div className="p-4">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <Link
          to="/admin/manage-orders"
          className="flex items-center hover:text-blue-600"
        >
          <ShoppingCart size={16} className="mr-2" />
          Order Management
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">{data.orderNumber}</span>
      </div>

      {/* Page Header */}
      <div className="mb-14 ">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Order Detail Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor user order detail
        </p>
      </div>

      <div className=" mx-auto bg-white overflow-hidden">
        {/* Header and other sections remain unchanged */}
        <div className="flex justify-between items-center">
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
        <div className="grid md:grid-cols-3 gap-6 mt-10">
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
              <span>
                Coupon: {data.couponApplied?.couponCode || "No coupon applied"}
              </span>
            </div>
            <div>
              <span>
                Coupon discount:{" "}
                <strong>
                  {data.couponApplied?.offerAmount.toLocaleString("en-IN") || 0}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-blue-600" /> {/* Icon for Order Date */}
              <span className="font-semibold">
                Order Date: {new Date(data?.orderDate).toLocaleString()}
              </span>
            </div>
            {data.status === "Delivered" && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" />{" "}
                  {/* Icon for Delivered Date */}
                  <span className="font-semibold">
                    Delivery Date:{" "}
                    {new Date(data?.deliveryDate).toLocaleString()}
                  </span>
                </div>
                {data?.returnPolicy ? (
                  <div className="flex items-center space-x-2">
                    <Truck className="text-blue-600" />{" "}
                    {/* Icon for Expected Delivery Date */}
                    <span className="font-semibold">
                      Final Date:{" "}
                      {new Date(data?.returnWithinDate).toLocaleString()}
                    </span>
                  </div>
                ) : (<span className="text-red-600">Return is not available</span>)}
              </>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="mt-5">
          <h3 className="font-semibold text-gray-700">Order Item</h3>
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
              <p className="font-semibold">
                ₹
                {data.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-gray-600">Qty: {data.quantity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Modal */}
      {orderModalVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold">
              Confirm Order Status Change
            </h3>
            <p className="mt-4">
              This will change the order status to {selectedStatus.orderStatus}{" "}
              and payment status to {selectedStatus.paymentStatus}. Continue?
            </p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setOrderModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateStatus(
                    selectedStatus.orderStatus,
                    selectedStatus.paymentStatus
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Modal */}
      {paymentModalVisible && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold">
              Confirm Payment Status Change
            </h3>
            <p className="mt-4">
              Are you sure you want to change the payment status to{" "}
              {selectedStatus.paymentStatus}?
            </p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setPaymentModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateStatus(
                    selectedStatus.orderStatus,
                    selectedStatus.paymentStatus
                  )
                }
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
