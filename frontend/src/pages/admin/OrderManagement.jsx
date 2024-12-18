import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAllOrdersQuery } from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router";
import Pagination from "../../components/Pagination";
import { ChevronRight, Home, Link } from "lucide-react";

const OrderManagement = () => {
  const pageSize = 10;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery({
    page: currentPage || 1,
    limit: pageSize,
  });

  const { orders, totalCount = 0 } = data || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (totalCount) {
      setTotalPages(Math.ceil(totalCount / pageSize));
    }
  }, [totalCount]);

  const handleClick = (order) => {
    navigate(`/admin/order/${order._id}`);
  };

  const orderColumns = [
    {
      key: "orderNumber",
      label: "Order Id",
      render: (value) => value,
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (value) =>
        new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      key: "name",
      label: "Number of items",
      render: (value) => value,
    },
    {
      key: "price",
      label: "Price",
      render: (value) => value,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        let bgColor, textColor;
        switch (value) {
          case "Order placed":
            bgColor = "bg-blue-200";
            textColor = "text-blue-800";
            break;
          case "Processing":
            bgColor = "bg-yellow-200";
            textColor = "text-yellow-800";
            break;
          case "Shipped":
            bgColor = "bg-purple-200";
            textColor = "text-purple-800";
            break;
          case "Out for delivery":
            bgColor = "bg-orange-200";
            textColor = "text-orange-800";
            break;
          case "Delivered":
            bgColor = "bg-green-200";
            textColor = "text-green-800";
            break;
          case "Cancelled":
            bgColor = "bg-red-200";
            textColor = "text-red-800";
            break;
          case "Returned":
            bgColor = "bg-gray-200";
            textColor = "text-gray-800";
            break;
          default:
            bgColor = "bg-gray-200";
            textColor = "text-gray-800";
            break;
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${bgColor} ${textColor}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (value) => {
        let bgColor, textColor;

        switch (value) {
          case "Pending":
            bgColor = "bg-yellow-200";
            textColor = "text-yellow-800";
            break;
          case "Success":
            bgColor = "bg-green-200";
            textColor = "text-green-800";
            break;
          case "Refunded":
            bgColor = "bg-blue-200";
            textColor = "text-blue-800";
            break;
          default:
            bgColor = "bg-gray-200";
            textColor = "text-gray-800";
            break;
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${bgColor} ${textColor}`}
          >
            {value}
          </span>
        );
      },
    },
  ];

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
    <div className="pt-6">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Order Management</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Order Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage and monitor user orders
        </p>
      </div>
      <div className="">
        <SearchBar />
      </div>
      <div className="max-w-7xl mx-auto p-4 bg-white">
        <ListItem
          items={orders}
          columns={orderColumns}
          textColor="text-skyBlue"
          clickList={handleClick}
        />
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
