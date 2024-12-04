import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListItem = ({ title, items, columns, icon, textColor, actions }) => {
  return (
    <div
      className={`rounded-lg shadow-md bg-gray-100 dark:bg-black p-10 ${
        textColor || "text-gray-800"
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
            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:text-white text-darkText"
          >
            {/* Render each column */}
            {columns.map((column) => (
              <div
                key={column.key}
                className={`flex flex-col text-center ${
                  column.className || ""
                }`}
              >
                <span>{column.label && column.label}</span>
                <span className="font-bold">
                  {column.render
                    ? column.render(item[column.key])
                    : item[column.key] || "N/A"}
                </span>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {item.controls.map((control, index) => (
                <button
                  key={index}
                  onClick={control.action}
                  className={`${control.style} text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-transform transform hover:scale-105`}
                >
                  {control.icon && (
                    <FontAwesomeIcon icon={control.icon} className="text-md" />
                  )}
                  <span>{control.text}</span>
                </button>
              ))}
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
