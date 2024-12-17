import React from "react";
import SearchBar from "../../components/SearchBar";
import ListItem from "../../components/admin/ListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAllOrdersQuery } from "../../redux/slices/orderApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router";

const OrderManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery();
    
    const orders = data || [];1
  
  console.log(orders);
  

  const handleChange = (userId) => {
    console.log(`Changing order with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
  };

  const orderControle = (userId) => [
    {
      text: "Update ",
      action: () => handleChange(userId),
      style: "bg-green-700 hover:bg-green-800",
      icon: "fa-solid fa-pen",
    },
    {
      text: "Delete",
      action: () => handleDelete(userId),
      style: "bg-red-700 hover:bg-red-800",
      icon: "fa-solid fa-trash",
    },
  ];


  const handleClick = (order) => {
    navigate(`/admin/order/${order._id}`)
  }

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
      key: "orderItems",
      label: "Number of items",
      render: (value) => {
        return value.reduce((acc, cur) => {
          return (acc += cur.quantity);
        }, 0);
      },
    },
    {
      key: "pricing",
      label: "Total Price",
      render: (value) => value.total,
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
    <div className="pt-14">
      <div className="flex justify-center">
        <SearchBar />
      </div>
      <div className="max-w-7xl mt-10 ms-10 me-4 sm:me-10">
        <ListItem
          title="Order List"
          items={orders}
          columns={orderColumns}
          icon="fa-cart-shopping"
          textColor="text-skyBlue"
          clickList={handleClick}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
