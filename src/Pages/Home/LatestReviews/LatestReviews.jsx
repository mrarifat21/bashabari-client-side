import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { FaStar } from "react-icons/fa";

const LatestReviews = () => {
  const axios = useAxios();

  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestReviews"],
    queryFn: async () => {
      const res = await axios.get("/reviews/latest");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center text-lg font-medium py-10 text-text transition-colors duration-300">
        Loading reviews...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-lg font-medium text-warning py-10 transition-colors duration-300">
        Failed to load reviews.
      </p>
    );

  return (
    <section className="border-y-1 px-4 py-10 bg-background">  
      <div className=" md:py-16 w-11/12 mx-auto  text-text transition-colors duration-300 ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-button">
          Latest User Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-center text-text/70">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-surfaceColor rounded-2xl shadow-md hover:shadow-xl border border-border transition-transform transform hover:scale-105 duration-300"
              >
                <div className="p-5 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={review.userPhoto}
                      alt={review.userName}
                      className="w-14 h-14 rounded-full object-cover ring ring-button"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {review.userName}
                      </h3>
                      {/* ⭐ Stars */}
                      <div className="flex gap-[2px] mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <FaStar
                            key={idx}
                            className={
                              idx < review.rating
                                ? "text-yellow-400"
                                : "text-border/50"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <p className="text-sm font-medium text-highlight">
                    {review.propertyTitle}
                  </p>

                  {/* Comment */}
                  <p className="text-sm text-text/90 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestReviews;
