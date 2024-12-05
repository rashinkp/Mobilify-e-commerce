import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useLocation } from 'react-router'; 


    
const SideBarkLink = ({ icon, label, isSidebarOpen,path }) => {
  const location = useLocation();
  return (
    <div
      className={` flex items-center space-x-4 text-darkText hover:text-white cursor-pointer p-2 rounded-md hover:bg-gray-700 dark:text-white mt-2 ${
        (location.pathname === path ) && "bg-skyBlue text-white"
      }`}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
      <span className={`${!isSidebarOpen && "hidden"}`}>{label}</span>
    </div>
  );
};

export default SideBarkLink