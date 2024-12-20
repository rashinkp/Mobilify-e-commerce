import { AlertTriangle } from 'lucide-react';
import React from 'react'

const CancelConfirmation = ({
  handleCancelOrder,
  setShowCancelConfirmation,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center mb-4 text-yellow-500">
          <AlertTriangle className="mr-3 w-6 h-6" />
          <h3 className="text-xl font-bold dark:text-white">Cancel Order?</h3>
        </div>
        <p className="mb-4 dark:text-gray-300">
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowCancelConfirmation(false)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300"
          >
            No, Keep Order
          </button>
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmation