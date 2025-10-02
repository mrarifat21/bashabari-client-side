import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrashAlt, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxios from "../../../hooks/useAxios";

const ManageReviews = () => {
  //   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["allReviews"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reviews");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allReviews"]);
       Swal.fire({
              title: "Deleted!",
              text: "User has been removed.",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete review", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading)
    return (
      <p className="text-center py-8 text-secondary-content font-semibold text-lg">
        Loading...
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary text-center">
        Manage Reviews
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="card bg-base-200 shadow-lg border border-base-300 p-5 rounded-2xl flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.userPhoto || "/default-avatar.png"}
                alt="Reviewer"
                className="w-14 h-14 rounded-full border-2 border-primary object-cover"
              />
              <div className="overflow-hidden">
                <p className="font-semibold text-lg truncate">{review.userName}</p>
                <p className="text-sm text-secondary-content truncate max-w-xs">
                  {review.userEmail}
                </p>
              </div>
            </div>

            <div className="flex gap-1 text-yellow-400 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p className="text-text mb-6 flex-grow break-words whitespace-pre-wrap">
              {review.comment}
            </p>

            <button
              onClick={() => handleDelete(review._id)}
              className="btn bg-red-500 btn-sm flex items-center gap-2 self-start hover:bg-red-600 transition-colors duration-200 border-0"
              aria-label={`Delete review by ${review.userName}`}
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageReviews;
