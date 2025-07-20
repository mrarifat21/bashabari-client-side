import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-2">Something went wrong.</h2>
        <p className="text-gray-700 mb-6">
          An unexpected error has occurred. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
