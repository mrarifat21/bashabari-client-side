import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const AddReviewModal = ({ propertyId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!user) {
      return Swal.fire("Unauthorized", "Please log in to leave a review.", "warning");
    }

    const reviewData = {
      propertyId,
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
      <button className="btn btn-outline btn-info mt-6" onClick={() => document.getElementById("add_review_modal").showModal()}>
        Add a Review 📝
      </button>

      <dialog id="add_review_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Rating (1 to 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                {...register("rating", { required: true })}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">Comment</label>
              <textarea
                {...register("comment", { required: true })}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button type="button" className="btn" onClick={() => document.getElementById("add_review_modal").close()}>
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
