import React from "react";
import Sidebar from "../../components/admin/SideBar";
import Widget from "../../components/admin/Widget.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import ListCard from "../../components/admin/ListCard.jsx";
import SalesChart from "../../components/admin/SalesChart.jsx";

const Dashboard = () => {
  const widgets = [
    {
      title: "Total Sales",
      icon: "fas fa-dollar-sign",
      value: "$37,802",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Products",
      icon: "fas fa-boxes",
      value: "1,245",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Total Users",
      icon: "fas fa-users",
      value: "9,745",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Orders",
      icon: "fas fa-shopping-cart",
      value: "4,502",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  const productList = [
    { name: "Product A", value: "120 sales" },
    { name: "Product B", value: "85 sales" },
    { name: "Product C", value: "70 sales" },
    { name: "Product A", value: "120 sales" },
    { name: "Product B", value: "85 sales" },
    { name: "Product C", value: "70 sales" },
  ];

  const userList = [
    { name: "User X", value: "Gold Member" },
    { name: "User Y", value: "Silver Member" },
    { name: "User Z", value: "Bronze Member" },
    { name: "User X", value: "Gold Member" },
    { name: "User Y", value: "Silver Member" },
    { name: "User Z", value: "Bronze Member" },
  ];

  const orderList = [
    { name: "Order #1234", value: "$300" },
    { name: "Order #5678", value: "$150" },
    { name: "Order #9101", value: "$450" },
    { name: "Order #1234", value: "$300" },
    { name: "Order #5678", value: "$150" },
    { name: "Order #9101", value: "$450" },
  ];

  return (
    <>
      <div className="flex">
        
        <div className="flex flex-col items-center w-full">
          <div className="mb-8 w-full flex justify-center max-w-7xl px-4 mt-10">
            <SearchBar />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {widgets.map((widget, index) => (
              <Widget
                key={index}
                title={widget.title}
                icon={widget.icon}
                value={widget.value}
                bgColor={widget.bgColor}
                textColor={widget.textColor}
              />
            ))}
          </div>
          <div className="mt-14 px-10 grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {/* Sales Chart takes 70% width */}
            <div className="col-span-6 md:col-span-8">
              <div className="w-full">
                <SalesChart />
              </div>
            </div>
            {/* List Card takes 30% width */}
            <div className="col-span-4 md:col-span-4">
              <div className="w-full">
                <ListCard
                  title="Top Products"
                  items={productList}
                  icon="fas fa-box"
                  bgColor="bg-gray-100 dark:bg-black"
                  textColor="text-blue-600"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 w-full px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6  align-center">
              {/* List Card for Top Users */}
              <div className="w-10/12">
                <ListCard
                  title="Top Users"
                  items={userList}
                  icon="fas fa-user"
                  bgColor="bg-gray-100 dark:bg-black"
                  textColor="text-green-600"
                />
              </div>
              {/* List Card for Top Orders */}
              <div className="w-10/12">
                <ListCard
                  title="Top Orders"
                  items={orderList}
                  icon="fas fa-shopping-cart"
                  bgColor="bg-gray-100 dark:bg-black"
                  textColor="text-yellow-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
