import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useProductReviewQuery } from "../../redux/slices/reviewApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { Star, ThumbsUp, MessageSquare, Calendar } from "lucide-react";

const Review = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState(null);
  const { data = {}, isLoading } = useProductReviewQuery({ productId: id });

  useEffect(() => {
    if (data) setReviews(data);
  }, [data]);

  const StarRating = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={`${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm flex items-center justify-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          strokeColor="#fff"
          strokeWidth="2"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {reviews?.length > 0 ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <p className="text-gray-600">{reviews.length} reviews</p>
          </div>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={
                          review?.userInfo?.profilePicture ||
                          "/api/placeholder/48/48"
                        }
                        alt={review?.userInfo?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review?.userInfo?.name || "Anonymous"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <time className="text-sm text-gray-500">
                    {new Date(review.updatedAt).toLocaleDateString()}
                  </time>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {review.description}
                  </p>
                </div>

                {/* <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                    <ThumbsUp size={16} />
                    <span className="text-sm">Helpful</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                    <MessageSquare size={16} />
                    <span className="text-sm">Reply</span>
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No reviews yet
          </h3>
          <p className="mt-2 text-gray-500">
            Be the first to review this product
          </p>
        </div>
      )}
    </div>
  );
};

export default Review;
