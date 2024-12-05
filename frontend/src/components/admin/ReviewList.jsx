import React from 'react'

const ReviewList = ({reviews}) => {
  return (
    <div className="p-6 dark:bg-black">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Reviews
      </h2>
      <ul className="mt-4 text-gray-600 dark:text-white space-y-2">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="bg-gray-100 dark:bg-darkBackground p-4 rounded-md shadow-sm"
          >
            <p>
              <strong>Comment:</strong> {review.comment}
            </p>
            <p>
              <strong>Date:</strong> {review.date}
            </p>
            <p>
              <strong>Rating:</strong> {"⭐".repeat(review.rating)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewList