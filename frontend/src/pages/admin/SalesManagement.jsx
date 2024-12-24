import React, { useState } from "react";
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

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSalesReportQuery();

  console.log(data);

  const salesData = data?.orders || [];
  console.log(salesData);
  // Calculate summary statistics
  const totalSales = data?.totalCount;
  const totalDiscount = salesData.reduce(
    (sum, item) => sum + item?.couponApplied?.offerAmount,
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

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 15);

    // Add summary section
    doc.setFontSize(12);
    doc.text(`Total Sales: ${totalSales}`, 14, 25);
    doc.text(
      `Total Amount: ₹${data?.totalPrice?.toLocaleString("en-IN")}`,
      14,
      32
    );
    doc.text(`Total Discount: ₹${totalDiscount.toLocaleString()}`, 14, 39);

    // Add table
    const formattedData = formatDataForExport(salesData);
    doc.autoTable({
      head: [
        ["Date", "Product", "Quantity", "Amount", "Discount", "Coupon Code"],
      ],
      body: formattedData.map((row) => Object.values(row)),
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 85, 105] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save PDF
    doc.save(`Sales_Report_${new Date().toLocaleDateString()}.pdf`);
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
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Range</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                <td className="px-6 py-4">${sale.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  ${sale.couponApplied?.offerAmount?.toLocaleString()}
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
