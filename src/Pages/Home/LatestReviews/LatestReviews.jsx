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
      <p className="text-center text-lg font-medium py-10">
        Loading reviews...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-lg font-medium text-red-500 py-10">
        Failed to load reviews.
      </p>
    );

  return (
    <section className="px-4 py-10 md:py-14 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        🌟 Latest User Reviews
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="card bg-base-100 shadow-lg hover:shadow-2xl transition duration-300 border border-base-200"
          >
            <div className="card-body space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={review.userPhoto}
                  alt={review.userName}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
                />
                <div>
                  <h3 className="text-lg font-semibold">{review.userName}</h3>
                  {/* ⭐ Rating stars */}
                  <p className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={
                          idx < review.rating
                            ? "text-yellow-400"
                            : "text-base-300 dark:text-neutral-content/20"
                        }
                      />
                    ))}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-primary font-medium">
                  {review.propertyTitle}
                </p>
              </div>

              <p className="text-sm leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestReviews;
