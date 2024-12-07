import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListItem = ({
  title,
  items = [],
  controles = () => [],
  columns,
  icon,
  textColor,
  actions,
}) => {
  return (
    <div
      className={`rounded-lg shadow-md p-4 sm:p-8 ${
        textColor || "text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-xl" />}
          <h2 className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            {title}
          </h2>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {/* List or No Users Found */}
      {items.length === 0 ? (
        <p className="text-center text-white">No data found</p>
      ) : (
        <ul className="space-y-6">
          {items.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:text-white text-darkText"
            >
              <div className="flex flex-col md:flex-row justify-between items-start sm:items-center space-y-4 md:space-y-0">
                {/* Render each column */}
                <div className="flex flex-col lg:flex-row sm:items-center lg:space-x-8 flex-grow">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={`flex flex-col items-start text-center sm:text-left ${
                        column.className || ""
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {column.label && column.label}
                      </span>
                      <span className="font-bold text-md truncate max-w-[150px]">
                        {column.render
                          ? column.render(item[column.key])
                          : item[column.key] || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
                  {controles(item._id).map((control, index) => (
                    <button
                      key={index}
                      onClick={control.action}
                      className={`${control.style} text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 my-1`}
                    >
                      {control.icon && (
                        <FontAwesomeIcon
                          icon={control.icon}
                          className="text-md"
                        />
                      )}
                      <span>{control.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListItem;
