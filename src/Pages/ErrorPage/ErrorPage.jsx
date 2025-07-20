import React from "react";
import { Link } from "react-router"; 

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="text-center p-10 bg-base-100 rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-extrabold text-error mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold mb-3 text-primary">
          Something went wrong.
        </h2>
        <p className="text-gray-500 mb-8">
          An unexpected error has occurred. Please try again later.
        </p>

        <Link to="/" className="btn btn-primary btn-md">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
