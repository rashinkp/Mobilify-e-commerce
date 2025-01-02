import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Star } from "lucide-react";
import { reviewSchema } from "../../validationSchemas";
import {
  useGetAReviewQuery,
  usePostReviewMutation,
} from "../../redux/slices/reviewApiSlice";
import { errorToast, successToast } from "../toast";
import { RotatingLines } from "react-loader-spinner";

const ProductReviewForm = ({ order }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [postReview] = usePostReviewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(reviewSchema),
  });

  const watchedFields = watch(["rating", "title", "description"]);

  const {
    data = {},
    isLoading,
    isError,
    refetch,
  } = useGetAReviewQuery({ productId: order.productId });

  useEffect(() => {
    if (data) {
      setReview(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (review) {
      setValue("rating", review.rating || 0);
      setValue("title", review.title || "");
      setValue("description", review.description || "");
    }
  }, [review, setValue]);

  // Check for changes in form values
  useEffect(() => {
    if (!review) return;

    const hasChanged =
      watchedFields[0] !== review.rating ||
      watchedFields[1] !== review.title ||
      watchedFields[2] !== review.description;

    setIsFormChanged(hasChanged);
  }, [watchedFields, review]);

  const onSubmit = async (data) => {
    try {
      await postReview({ data, order }).unwrap();
      successToast("Review posted successfully");
      setIsFormChanged(false);
    } catch (error) {
      errorToast(
        error?.message || error?.data?.message || "Error while posting review"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
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
    <div className="mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Write a Review
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setValue("rating", star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || watch("rating"))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        {/* Review Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Review Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className={`w-full px-4 py-2 border ${
              errors.title
                ? "border-red-600 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            } rounded-md`}
            placeholder="Summarize your review"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Review Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Review Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={`w-full px-4 py-2 border ${
              errors.description
                ? "border-red-600 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            } rounded-md`}
            placeholder="Write your detailed review here..."
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="max-w-lg bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={!isFormChanged}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReviewForm;
