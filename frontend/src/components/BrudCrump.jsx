import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BrudCrump = ({ list }) => {
  return (
    <nav className="flex flex-wrap items-center py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
        {list.map((item, i) => (
          <div key={i} className="flex items-center mb-6 text-sm">
            <Link
              to={item.path}
              className="flex gap-2 items-center hover:text-blue-600"
            >
              {item.icon}
              {item.name}
            </Link>
            <ChevronRight size={16} className="mx-2" />
          </div>
        ))}
      </ol>
    </nav>
  );
};

export default BrudCrump;
