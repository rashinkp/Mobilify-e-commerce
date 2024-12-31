import React from "react";

const TableComponent = ({ title, headers, data }) => {
  const transformedData = data.map((item, index) => ({
    name: item.name,
    sales: item.sales,
    revenue: `₹${item?.totalRevenue?.toLocaleString("en-In", {
      minimumFractionDigits: 2,
    })}`,
    rank: `#${index + 1}`,
  }));

  return (
    <div className="relative overflow-x-auto mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformedData.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              {Object.values(item).map((value, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {value}
                  </th>
                ) : (
                  <td key={i} className="px-6 py-4">
                    {value}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
