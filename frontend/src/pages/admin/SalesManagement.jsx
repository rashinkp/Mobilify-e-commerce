import React, { useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Database,
  Download,
  Filter,
  Home,
} from "lucide-react";
import { Link } from "react-router";
import { useGetSalesReportQuery } from "../../redux/slices/salesApiSlice";
import { RotatingLines } from "react-loader-spinner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SalesReport = () => {
  const [dateRange, setDateRange] = useState("daily");
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState("");

  const today = new Date();

  useEffect(() => {
    switch (dateRange) {
      case "daily":
        setStartingDate(today.toISOString().split("T")[0]);
        setEndingDate(today.toISOString().split("T")[0]);
        break;
      case "weekly": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        setStartingDate(weekStart.toISOString().split("T")[0]);
        setEndingDate(today.toISOString().split("T")[0]);
        break;
      }
      case "monthly": {
        const monthStart = new Date(today);
        monthStart.setMonth(today.getMonth() - 1);
        setStartingDate(monthStart.toISOString().split("T")[0]);
        setEndingDate(today.toISOString().split("T")[0]);
        break;
      }
      case "custom":
        setShowDatePicker(true);
        break;
      default:
        break;
    }
  }, [dateRange]);

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSalesReportQuery({
    startingDate,
    endingDate,
  });

  const handleFilter = () => {
    if (startingDate && endingDate) {
      refetch();
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const salesData = data?.orders || [];

  console.log(salesData);

  const totalSales = data?.totalCount;
  const totalDiscount = salesData.reduce(
    (sum, item) =>
      sum + item?.couponApplied?.offerAmount + item?.offerPrice || 0,
    0
  );

  //

  const formatDataForExport = (data) => {
    return data.map((sale) => ({
      Date: new Date(sale.orderDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      Product: sale.name,
      Quantity: sale.quantity,
      Amount: `₹${sale.price.toLocaleString()}`,
      Discount: `₹${sale.couponApplied?.offerAmount?.toLocaleString() || "0"}`,
      "Coupon Code": sale.couponApplied?.couponCode || "Not applied",
    }));
  };

  // Function to download Excel file
  const downloadExcel = () => {
    const formattedData = formatDataForExport(salesData);

    // Add summary rows at the end
    formattedData.push(
      {}, // Empty row for spacing
      {
        Date: "Summary",
        Product: "",
        Quantity: `Total Sales: ${totalSales}`,
        Amount: `Total Amount: ₹${data?.totalPrice?.toLocaleString("en-IN")}`,
        Discount: `Total Discount: ₹${totalDiscount.toLocaleString()}`,
        "Coupon Code": "",
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    // Generate & Download Excel file
    XLSX.writeFile(
      workbook,
      `Sales_Report_${new Date().toLocaleDateString()}.xlsx`
    );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Colors and theme
    const indigo600 = [79, 70, 229]; // RGB for indigo-600
    const gray200 = [245, 245, 245]; // Light gray for alternate rows

    // Dummy data for dates
    const fromDate = new Date(startingDate).toLocaleDateString("en-IN");
    const toDate = new Date(endingDate).toLocaleDateString("en-IN");

    // Add project name and title
    doc.setFontSize(18);
    doc.setTextColor(...indigo600);
    doc.setFont("helvetica", "bold");
    doc.text("Mobilify", 14, 15); // Project Name
    doc.setFontSize(14);
    doc.text("Sales Report", 14, 25); // Report Title

    // Add horizontal line under the title
    doc.setDrawColor(indigo600[0], indigo600[1], indigo600[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 28, 196, 28); // x1, y1, x2, y2

    // Add summary section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black text
    doc.text(`From Date: ${fromDate}`, 14, 35); // From Date
    doc.text(`To Date: ${toDate}`, 100, 35); // To Date
    doc.text(`Total Sales: Rs. ${totalSales.toLocaleString("en-IN")}`, 14, 42); // Total Sales
    doc.text(
      `Total Amount: Rs. ${data?.totalPrice.toLocaleString("en-IN")}`,
      14,
      49
    ); // Total Amount
    doc.text(
      `Total Discount: Rs. ${totalDiscount.toLocaleString("en-IN")}`,
      14,
      56
    ); // Total Discount

    // Add another horizontal line below summary
    doc.line(14, 59, 196, 59);

    // Add table
    const formattedData = salesData.map((row) => ({
      date: new Date(row.orderDate).toLocaleDateString("en-IN"),
      product: row?.name || "Not Available",
      quantity: row?.quantity || 0,
      amount: row?.price.toLocaleString("en-IN"),
      discount: row?.offerPrice.toLocaleString("en-IN"),
      couponCode: row?.couponApplied?.couponCode || "Not Applied",
    }));

    doc.autoTable({
      startY: 64,
      head: [
        [
          "Date",
          "Product",
          "Quantity",
          "Amount (Rs.)",
          "Discount (Rs.)",
          "Coupon Code",
        ], 
      ],
      body: formattedData.map((row) => Object.values(row)),
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: indigo600,
        textColor: [255, 255, 255], 
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: gray200 },
      bodyStyles: { textColor: [0, 0, 0] }, 
      theme: "grid", 
      margin: { top: 10 },
    });

    // Footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(...indigo600);
      doc.text(
        `Page ${i} of ${pageCount}`,
        196 - 20,
        doc.internal.pageSize.height - 10
      ); 
    }

    doc.save(`Mobilify_Sales_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  //

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
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center mb-6 text-sm text-gray-500">
        <Link to="/admin" className="flex items-center hover:text-blue-600">
          <Home size={16} className="mr-2" />
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">Sales Management</span>
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Report</h1>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3">
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setShowDatePicker(e.target.value === "custom");
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Range</option>
          </select>

          {showDatePicker && (
            <div className="flex gap-2">
              <input
                type="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              />
            </div>
          )}

          <button
            onClick={handleFilter}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={downloadExcel}
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Showing sales from:</span>
        <span className="font-medium">
          {dateRange === "daily"
            ? "Today"
            : `${formatDate(startingDate)} - ${formatDate(endingDate)}`}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">
            Total Sales Count
          </h3>
          <p className="text-2xl font-bold mt-2">{totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
          <p className="text-2xl font-bold mt-2">
            ₹{data?.totalPrice?.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-600">Total Discount</h3>
          <p className="text-2xl font-bold mt-2">
            ₹{totalDiscount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Coupon
              </th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(sale.orderDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {sale.name}
                </td>
                <td className="px-6 py-4">{sale.quantity}</td>
                <td className="px-6 py-4">₹{sale.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  ₹
                  {(
                    sale.couponApplied?.offerAmount + sale?.offerPrice || 0
                  )?.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {sale?.couponApplied?.couponCode || "Not applied"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
