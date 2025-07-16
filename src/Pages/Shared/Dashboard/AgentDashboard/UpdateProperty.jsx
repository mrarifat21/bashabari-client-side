import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { useEffect } from "react";

const UpdateProperty = () => {
  const { id } = useParams();
//   const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch property by ID
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/properties/${id}`);
      return res.data;
    },
  });
console.log(property);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // After data is loaded, set form default values
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        location: property.location,
        image: property.image,
        priceMin: property.priceMin,
        priceMax: property.priceMax,
      });
    }
  }, [property, reset]);

  // Mutation for update
  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(`/properties/${id}`, updatedData),
    onSuccess: (res) => {
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Property updated", "success");
        queryClient.invalidateQueries(["property", id]);
        navigate("/dashboard/myAddedProperties");
      } else {
        Swal.fire("Warning", "No changes were made", "warning");
      }
    },
    onError: () => {
      Swal.fire("Error", "Update failed", "error");
    },
  });

  const onSubmit = (data) => {
    const updatedProperty = {
      ...data,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      status: "pending", // reset verification
    };
    mutation.mutate(updatedProperty);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Update Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="label">Property Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.location && (
            <p className="text-red-500">Location is required</p>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="label">Image URL</label>
          <input
            type="text"
            {...register("image", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.image && (
            <p className="text-red-500">Image URL is required</p>
          )}
        </div>

        {/* Price */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="label">Minimum Price</label>
            <input
              type="number"
              {...register("priceMin", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex-1">
            <label className="label">Maximum Price</label>
            <input
              type="number"
              {...register("priceMax", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Read-only agent info */}
        <div>
          <label className="label">Agent Name</label>
          <input
            type="text"
            value={property?.agentName}
            readOnly
            className="input input-bordered w-full "
          />
        </div>
        <div>
          <label className="label">Agent Email</label>
          <input
            type="text"
            value={property?.agentEmail}
            readOnly
            className="input input-bordered w-full "
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default UpdateProperty;
