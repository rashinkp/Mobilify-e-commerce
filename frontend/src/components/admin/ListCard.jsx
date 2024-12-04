import React from "react";

const ListCard = ({ title, items, icon, bgColor, textColor }) => {
  return (
    <div className={`px-7 py-5 rounded-lg shadow-md ${bgColor} ${textColor}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className={`${icon} mr-2`}></i> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 rounded-md bg-white dark:bg-darkBackground shadow-sm hover:shadow-md hover:bg-gray-50"
          >
            <span className="font-medium text-sm truncate">{item.name}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListCard;
