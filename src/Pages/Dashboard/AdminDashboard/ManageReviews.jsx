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
      Swal.fire("Deleted!", "Review has been removed.", "success");
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

  if (isLoading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="card bg-base-100 shadow border p-4">
            <div className="flex items-center gap-4 mb-2">
              <img
                src={review.userPhoto || "/default-avatar.png"}
                alt="Reviewer"
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <p className="font-semibold">{review.userName}</p>
                <p className="text-sm text-gray-500">{review.userEmail}</p>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-2">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            <button
              onClick={() => handleDelete(review._id)}
              className="btn btn-error btn-sm flex items-center gap-2"
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
