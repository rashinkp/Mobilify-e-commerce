import React from "react";
import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";

const Table = ({
  title,
  items = [],
  columns,
  icon: Icon,
  textColor,
  actions,
  clickRow,
  controles,
}) => {
  return (
    <div className={`p-4 ${textColor || "text-gray-800"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          {Icon && <Icon className="mr-2 text-xl text-gray-600" size={24} />}
          <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            {title}
          </h2>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {/* Table or No Data Found */}
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No data found</p>
      ) : (
        <div className="w-full">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b ">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3  text-gray-800 font-medium uppercase text-xs"
                  >
                    {column.label}
                  </th>
                ))}
                {/* Action column */}
                <th className="px-4 py-3 text-gray-800 font-medium uppercase text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                  onClick={() => clickRow(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-gray-700">
                      {column.render
                        ? column.render(item[column.key])
                        : item[column.key] || "N/A"}
                    </td>
                  ))}
                  {/* Action Buttons */}
                  <td className="px-4 py-4">
                    <div className="flex gap-5 items-center ">
                      {/* Render controles if provided */}
                      {controles &&
                        controles(item).map((control, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              control.action();
                            }}
                            className={`rounded text-white ${control.style}`}
                          >
                            {control.icon}
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  textColor: PropTypes.string,
  actions: PropTypes.array,
};

export default Table;
