import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["myReviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user?email=${user.email}`);
      return res.data;
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const res = await axiosSecure.delete(`/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Review removed successfully.", "success");
      queryClient.invalidateQueries(["myReviews", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete review.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReviewMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading your reviews...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">You haven’t reviewed any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 bg-base-100 rounded-xl border shadow space-y-2"
            >
              <h3 className="text-xl font-semibold">{review.propertyTitle}</h3>
              <p className="text-sm text-gray-500">Agent: {review.agentName}</p>
              <p className="text-sm text-gray-400">
                {format(new Date(review.createdAt), "PPPpp")}
              </p>
              <p className="text-gray-700">{review.comment}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="btn btn-error btn-sm mt-2"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
