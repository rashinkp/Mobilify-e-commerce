import React from "react";
import { RefreshCcw, Home, ArrowLeft } from "lucide-react";

const ErrorPage = ({
  code = "404",
  title = "Page not found",
  message = "Sorry, we couldn't find the page you're looking for.",
  showHomeButton = true,
  showBackButton = true,
  showRetryButton = true,
}) => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/user";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Code */}
        <div className="space-y-3">
          <h1 className="text-9xl font-extrabold text-gray-900">{code}</h1>

          {/* Error Title */}
          <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>

          {/* Error Message */}
          <p className="mt-4 text-base text-gray-500">{message}</p>
        </div>

        {/* Decorative Element */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-50 text-sm text-gray-500">
                Let's get you back on track
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {showRetryButton && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Retry
            </button>
          )}

          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
