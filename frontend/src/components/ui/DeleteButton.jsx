import { faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const DeleteButton = () => {
  return (
    <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
      <FontAwesomeIcon icon={faTrashRestore} />
      <span>Delete Permanently</span>
    </button>
  );
}

export default DeleteButton