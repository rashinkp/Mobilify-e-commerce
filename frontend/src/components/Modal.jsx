import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const Modal = ({title , description , controles}) => {
  return (
    <>
      <div
        id="popup-modal"
        className="h-screen flex backdrop-blur-md overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0  max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="p-4 md:p-5 text-center flex flex-col gap-8">
              <div className=" flex flex-col gap-5">
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-exclamation"
                  className="text-black dark:text-white"
                  size="2xl"
                />
                <h3 className="text-lg font-normal text-black dark:text-white">
                  {title}
                </h3>
                <span className="text-black dark:text-white">
                  {description}
                </span>
              </div>
              <div className="flex justify-center gap-3">
                {controles.map((control, index) => (
                  <button
                    key={index}
                    onClick={(userId) => control.action(userId)}
                    data-modal-hide="popup-modal"
                    type="button"
                    className={`${control.style} font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
                  >
                    {control.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal