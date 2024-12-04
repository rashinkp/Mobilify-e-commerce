import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const ArchiveButton = () => {
  return (
    <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
      <FontAwesomeIcon icon={faArchive} />
      <span>Archive</span>
    </button>
  );
}

export default ArchiveButton