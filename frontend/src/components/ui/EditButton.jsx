import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const EditButton = () => {
  return (
    <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
      <FontAwesomeIcon icon={faEdit} />
      <span>Edit</span>
    </button>
  );
}

export default EditButton