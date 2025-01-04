import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SignGoogle = () => {
  return (
    <div className="max-w-lg mx-auto  py-7 px-5 flex items-center justify-center gap-3 rounded-xl cursor-pointer dark:bg-black dark:text-lightText shadow-md rounded-md">
      <FontAwesomeIcon
        icon="fa-brands fa-google"
        size="xl"
        className="text-indigo-600"
      />
      <span>Sign with Google</span>
    </div>
  );
};

export default SignGoogle;
