import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignGoogle = () => {
  return (
    <div className="max-w-lg mx-auto bg-gray-200 py-7 px-5 flex items-center justify-center gap-3 rounded-xl cursor-pointer dark:bg-black dark:text-lightText">
      <FontAwesomeIcon
        icon="fa-brands fa-google"
        size="xl"
        className="text-blue"
      />
      <span>Sign with Google</span>
    </div>
  );
};

export default SignGoogle;
