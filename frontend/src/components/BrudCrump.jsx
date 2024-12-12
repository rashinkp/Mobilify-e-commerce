import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const BrudCrump = ({ list }) => {
  return (
    <nav className="flex flex-wrap items-center py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
        {list.map((item, i) => (
          <li key={i} className="flex items-center">
            {i !== 0 && (
              <FontAwesomeIcon
                icon="fa-solid fa-arrow-right"
                className="me-4 text-gray-500"
                aria-hidden="true"
              />
            )}
            <Link
              to={item.path}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BrudCrump;
