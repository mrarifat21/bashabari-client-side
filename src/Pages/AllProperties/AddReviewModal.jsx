import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useUserRole from "../../hooks/useUserRole";

const AddReviewModal = ({ propertyId, propertyTitle, agentName }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { register, handleSubmit, reset } = useForm();
  const { role, roleLoading } = useUserRole(); // 🔑 role validation hook
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      return Swal.fire("Unauthorized", "Please log in to leave a review.", "warning");
    }

    if (roleLoading) return; // Wait until role is loaded

    if (role !== "user") {
      return Swal.fire("Permission Denied", "Only users can leave reviews.", "error");
    }

    const reviewData = {
      propertyId,
      agentName,
      propertyTitle,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      rating: parseFloat(data.rating),
      comment: data.comment,
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      const res = await axiosSecure.post("/reviews", reviewData);
      if (res.data.insertedId) {
        Swal.fire("Success", "Review added successfully!", "success");
        reset();
        document.getElementById("add_review_modal").close();
      } else {
        Swal.fire("Error", "Failed to add review.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline btn-primary mt-6"
        onClick={() => {
          if (!user) {
            Swal.fire("Login Required", "Please log in to leave a review.", "info");
          } else if (role !== "user") {
            Swal.fire("Access Denied", "Only normal users can leave reviews.", "error");
          } else {
            document.getElementById("add_review_modal").showModal();
          }
        }}
      >
        Add a Review 📝
      </button>

      <dialog id="add_review_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-200 text-base-content shadow-lg border border-secondary">
          <h3 className="text-2xl font-semibold text-primary mb-6">Write a Review</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Rating Input */}
            <div>
              <label className="label text-secondary-content font-semibold">Rating (1 to 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                {...register("rating", { required: true })}
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            {/* Comment Input */}
            <div>
              <label className="label text-secondary-content font-semibold">Comment</label>
              <textarea
                {...register("comment", { required: true })}
                className="textarea textarea-bordered w-full bg-base-100"
                rows={4}
                placeholder="Share your experience..."
              />
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button type="submit" className="btn btn-primary border-0" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                className="btn btn-ghost border-1 border-white"
                onClick={() => document.getElementById("add_review_modal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddReviewModal;
