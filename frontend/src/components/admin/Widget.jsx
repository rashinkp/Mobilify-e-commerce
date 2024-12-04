import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Widget = ({ title, icon, value, bgColor, textColor }) => {
  return (
    <div
      className={`flex items-center p-4 rounded-lg shadow-md  ${bgColor} ${textColor}`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-opacity-20">
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium uppercase">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};



export default Widget;
