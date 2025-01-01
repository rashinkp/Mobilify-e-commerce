import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProductReviewQuery } from "../../redux/slices/reviewApiSlice";
import noImage from "../../assets/noImage.png";
import { RotatingLines } from "react-loader-spinner";
import { Star } from "lucide-react";

const Review = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState(null);

  const {
    data = {},
    isError,
    isLoading,
    refetch,
  } = useProductReviewQuery({ productId: id });

  useEffect(() => {
    if (data) {
      setReviews(data);
    }
  }, [data]);

  // Star Rating Component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeColor="#fff"
          strokeWidth="2"
          animationDuration="8"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <>
      {reviews?.length > 0 &&
        reviews?.map((review, index) => (
          <div key={index} className="p-6 m-5 mx-auto bg-white border-b">
            <div className="flex items-center mb-4">
              <img
                className="w-12 h-12 rounded-full object-cover border border-gray-300 mr-4"
                src={review?.userInfo?.profilePicture || noImage}
                alt="User profile"
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {review?.userInfo?.name || "Not available"}
                </div>
                <div className="ml-2">
                  <StarRating rating={review?.rating} />
                </div>
              </div>
            </div>
            <p className="font-bold">{review?.title}</p>
            <p className="text-gray-700 dark:text-lightText">
              {review?.description}
            </p>
          </div>
        ))}
    </>
  );
};

export default Review;
