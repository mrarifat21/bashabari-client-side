import { useQuery } from "@tanstack/react-query";

import { FaStar } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const PropertyReviews = ({ propertyId }) => {
  const axios = useAxios();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const res = await axios.get(`/reviews/${propertyId}`);
      return res.data;
    },
    enabled: !!propertyId, // only run when propertyId is available
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 border rounded-lg shadow-sm bg-base-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{review.userName}</p>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyReviews;
