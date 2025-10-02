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
      Swal.fire({
        title: "Deleted!",
        text: "Review removed successfully.",
        icon: "success",
        background: "#1C1C1C",
        color: "#EAEAEA",
      });
      queryClient.invalidateQueries(["myReviews", user?.email]);
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Failed to delete review.",
        icon: "error",
        background: "#1C1C1C",
        color: "#EAEAEA",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      background: "#1C1C1C",
      color: "#EAEAEA",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReviewMutation.mutate(id);
        Swal.fire({
          title: "Deleted!",
          text: "The review has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
      }
    });
  };

  if (isLoading)
    return (
      <div className="text-center py-10 bg-background text-text">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <section className="bg-background">
  <div className="max-w-6xl mx-auto p-4  min-h-screen text-text">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        My Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-text/70 text-center">
          You haven’t reviewed any properties yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 bg-base-200 rounded-xl border border-base-300 shadow space-y-2 text-text"
            >
              <h3 className="text-xl font-semibold text-primary">
                {review.propertyTitle}
              </h3>
              <p className="text-sm text-text/80">
                Agent: {review.agentName}
              </p>
              <p className="text-sm text-text/60">
                {format(new Date(review.createdAt), "PPPpp")}
              </p>
              <p className="text-text">{review.comment}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="btn bg-warning btn-sm mt-2 text-text border-0"
              >
                Delete Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </section>
  
  );
};

export default MyReviews;
