import React from "react";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2 text-red-500">Access Denied</h2>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default Forbidden;
