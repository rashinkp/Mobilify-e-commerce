import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  ShoppingBag,
  Tags,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Store,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useGetSalesDetailsQuery,
  useGetSalesForDashboardQuery,
  useGetSalesReportQuery,
} from "../../redux/slices/salesApiSlice";
import { RotatingLines } from "react-loader-spinner";
import {
  useAverageOrderValueQuery,
  useGetOrderDetailsQuery,
} from "../../redux/slices/orderApiSlice";
import {
  useGetProductDetailsQuery,
  useGetTopSellingProductsQuery,
} from "../../redux/slices/productApiSlice";
import TableComponent from "../../components/admin/BestSellerTable";
import { useBestSellingCategoryQuery } from "../../redux/slices/categoryApiSlices";

const products = [
  { name: "iPhone 13 Pro", sales: "1,234", revenue: "$1,234,567", rank: "#1" },
  { name: "Samsung S21", sales: "987", revenue: "$987,654", rank: "#2" },
  // Add more products...
];

const categories = [
  {
    category: "Smartphones",
    sales: "5,432",
    revenue: "$5,432,100",
    rank: "#1",
  },
  { category: "Laptops", sales: "4,321", revenue: "$4,321,000", rank: "#2" },
  // Add more categories...
];

const brands = [
  { brand: "Apple", sales: "8,765", revenue: "$8,765,432", rank: "#1" },
  { brand: "Samsung", sales: "7,654", revenue: "$7,654,321", rank: "#2" },
  // Add more brands...
];

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("daily");

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSalesForDashboardQuery({ timeFilter });

  const {
    data: salesDetails = {},
    isLoading: salesDetailsLoading,
    isError: salesDetailsError,
  } = useGetSalesDetailsQuery();

  const {
    data: orderDetails = {},
    isLoading: orderDetailsLoading,
    isError: orderDetailsError,
  } = useGetOrderDetailsQuery();

  const {
    data: productDetails = {},
    isLoading: productDetailsLoading,
    isError: productDetailsError,
  } = useGetProductDetailsQuery();

  const {
    data: averageOrderValue = {},
    isLoading: averageOrderValueLoading,
    isError: averageOrderValueError,
  } = useAverageOrderValueQuery();

  const {
    data: topProducts = {},
    isLoading: topProductsLoading,
    isError: topProductsError,
  } = useGetTopSellingProductsQuery();

  const {
    data: topCategory = {},
    isLoading: topCategoryLoading,
    isError: topCategoryError,
  } = useBestSellingCategoryQuery();

  // console.log(topCategory);

  const transformTimeSeriesData = (data, timeframe = "monthly", count = 6) => {
    const currentDate = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const createTemplate = (date, format) => {
      const formatNumber = (num) => Number(num.toFixed(2));
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const baseTemplate = {
        sales: 0,
        orders: 0,
        items: 0,
      };

      switch (format) {
        case "yearly":
          return {
            name: `${date.getFullYear()}`,
            ...baseTemplate,
          };
        case "monthly":
          return {
            name: `${date.getFullYear()}-${monthNames[date.getMonth()]}`,
            ...baseTemplate,
          };
        // Inside createTemplate function
        case "weekly": {
          const weekInMonth = Math.ceil(date.getDate() / 7);
          return {
            name: `W${weekInMonth}-${
              monthNames[date.getMonth()]
            }-${date.getFullYear()}`,
            ...baseTemplate,
          };
        }
        case "daily":
          return {
            name: `${date.getFullYear()}-${
              monthNames[date.getMonth()]
            }-${date.getDate()}`,
            ...baseTemplate,
          };
        default:
          throw new Error("Invalid timeframe");
      }
    };

    const generateTemplateData = () => {
      return Array.from({ length: count }, (_, i) => {
        const date = new Date(currentDate);

        switch (timeframe) {
          case "yearly":
            date.setFullYear(date.getFullYear() - i);
            break;
          case "monthly":
            date.setMonth(date.getMonth() - i);
            break;
          case "weekly":
            date.setDate(date.getDate() - i * 7);
            break;
          case "daily":
            date.setDate(date.getDate() - i);
            break;
        }

        return createTemplate(date, timeframe);
      }).reverse();
    };

    const templateData = generateTemplateData();
    const existingDataMap = Object.fromEntries(
      data.map((item) => [item.name, item])
    );

    return templateData.map((template) => ({
      ...template,
      ...(existingDataMap[template.name] || {}),
    }));
  };

  useEffect(() => {
    if (data.formattedData?.length > 0) {
      const detectTimeframe = (sampleData) => {
        const nameSample = sampleData[0].name;
        if (nameSample.includes("-")) {
          return nameSample.includes("W")
            ? "weekly"
            : nameSample.split("-").length > 2
            ? "daily"
            : "monthly";
        }
        return "yearly";
      };

      const timeframe = detectTimeframe(data.formattedData);
      const transformedData = transformTimeSeriesData(
        data.formattedData,
        timeframe
      );
      setSalesData(transformedData);
    } else {
      setSalesData([]);
    }
  }, [data]);

  const stats = [
    {
      title: "Total Sales",
      value:
        salesDetails?.totalPrice?.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }) || "₹0",
      icon: DollarSign,
      trend: `Total Sales Count ${salesDetails?.totalCount}`,
    },
    {
      title: "Total Orders",
      value: orderDetails?.totalOrders?.toLocaleString("en-IN") || "0",
      icon: ShoppingBag,
      trend: `Today ${orderDetails?.ordersToday} orders recieved`,
    },
    {
      title: "Total Items",
      value: productDetails?.productCount?.toLocaleString("en-IN") || "0",
      icon: Package,
      trend: `${productDetails?.activeProducts} products are active`,
    },
    {
      title: "Average Order Value",
      value:
        averageOrderValue?.averageOrderValue?.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }) || "₹0",
      icon: TrendingUp,
      trend: data?.aovGrowth
        ? `${data.aovGrowth > 0 ? "+" : ""}${
            data.aovGrowth
          }% from last ${timeFilter}`
        : "-",
    },
  ];

  if (
    isError ||
    orderDetailsError ||
    salesDetailsError ||
    productDetailsError ||
    averageOrderValueError ||
    topProductsError ||
    topCategoryError
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (
    isLoading ||
    orderDetailsLoading ||
    salesDetailsLoading ||
    productDetailsLoading ||
    averageOrderValueLoading ||
    topProductsLoading ||
    topCategoryLoading
  ) {
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
    <div className="min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p
                  className={`text-sm 
                    text-green-600
                  `}
                >
                  {stat.trend}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Sales Overview</h2>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div className="p-6">
          <div className="h-[70vh]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => Math.round(value)}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === "sales" ? `₹${value.toLocaleString()}` : value,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="#3b82f6"
                  name="Sales"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="#10b981"
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Three Column Grid */}
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <TableComponent
            title="Top 5 Best Selling Products"
            headers={["Product Name", "Sales", "Revenue", "Rank"]}
            data={topProducts}
          />
          <TableComponent
            title="Top Best Selling Categories"
            headers={["Category", "Sales", "Revenue"]}
            data={topCategory}
          />
          {/* <TableComponent
            title="Top 10 Best Selling Brands"
            headers={["Brand", "Sales", "Revenue", "Rank"]}
            data={brands}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
