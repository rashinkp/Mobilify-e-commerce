import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListItem = ({ title, items, columns, icon, textColor, actions }) => {
  return (
    <div
      className={`rounded-lg  shadow-md bg-gray-100 dark:bg-black p-2 sm:p-10 ${
        textColor || "text-gray-800 "
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {icon && <FontAwesomeIcon icon={icon} className="mr-2 text-xl" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {/* List */}
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:text-white text-darkText"
          >
            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center space-y-4 sm:space-y-0">
              {/* Render each column */}
              <div className="flex mx-auto flex-col md:flex-row sm:items-center sm:space-x-8 flex-grow">
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`flex flex-col text-center sm:text-left ${
                      column.className || ""
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-500">
                      {column.label && column.label}
                    </span>
                    <span className="font-bold text-lg">
                      {column.render
                        ? column.render(item[column.key])
                        : item[column.key] || "N/A"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-start sm:justify-end space-x-2 sm:space-x-4 space-y-2 sm:space-y-0 mx-auto items-center ">
                {item.controls.map((control, index) => (
                  <button
                    key={index}
                    onClick={control.action}
                    className={`${control.style} text-white justify-center  w-24 h-10 rounded-lg flex items-center space-x-2 transition-transform transform hover:scale-105 my-1 `}
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
    </div>
  );
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string,
      controls: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          action: PropTypes.func.isRequired,
          style: PropTypes.string.isRequired,
          icon: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      render: PropTypes.func, // Optional custom render function
      className: PropTypes.string, // Optional class for column
    })
  ).isRequired,
  icon: PropTypes.string,
  textColor: PropTypes.string,
  actions: PropTypes.node,
};

export default ListItem;
