import React from "react";
import { Link } from "react-router"; 

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-10">
      <div className="text-center p-10 bg-base-100 rounded-xl shadow-2xl max-w-md border border-base-300">
        <h1 className="text-7xl md:text-8xl font-extrabold text-error mb-4 drop-shadow-lg">Oops!</h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-primary">
          Something went wrong.
        </h2>
        <p className="text-base-content/80 mb-8">
          An unexpected error has occurred. Please try again later.
        </p>

        <Link to="/" className="btn btn-primary btn-md text-base-100 font-semibold hover:scale-105 transition-transform duration-300">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
