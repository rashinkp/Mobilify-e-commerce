import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const SoftDeleteButton = () => {
  return (
    <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
      <FontAwesomeIcon icon={faTrashAlt} />
      <span>Soft Delete</span>
    </button>
  );
}

export default SoftDeleteButton