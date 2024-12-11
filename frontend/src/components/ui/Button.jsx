import React from "react";

const Button = ({ icon, text, action }) => {
  return (
    <button
      type="button"
      onClick={action}
      className={`font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:bg-black dark:text-white border border-black flex gap-3 items-center`}
    >
      {icon|| ''} {text || ''}
    </button>
  );
};

export default Button;
