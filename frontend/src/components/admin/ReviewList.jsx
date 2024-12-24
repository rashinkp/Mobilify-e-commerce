import React from "react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="relative overflow-x-auto  dark:bg-black">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Reviews
      </h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Comment
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {review.comment}
              </td>
              <td className="px-6 py-4">{review.date}</td>
              <td className="px-6 py-4">{"⭐".repeat(review.rating)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;
