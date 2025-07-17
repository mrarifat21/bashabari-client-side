import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxios from "../../../hooks/useAxios";



const UpdateProperty = () => {
  const { id } = useParams();
  // const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch property by ID
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/properties/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Set form default values when property loads
  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        location: property.location,
        priceMin: property.priceMin,
        priceMax: property.priceMax,
      });
      setImageURL(property.image); // Set initial image
    }
  }, [property, reset]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_Image_Upload_Key
    }`;

    try {
      const res = await axios.post(uploadUrl, formData);
      const url = res.data.data.url;
      setImageURL(url);
    } catch (error) {
      console.error("Image upload failed", error);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // Submit updated data
  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(`/properties/${id}`, updatedData),
    onSuccess: (res) => {
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Property updated", "success");
        queryClient.invalidateQueries(["property", id]);
        navigate("/dashboard/myAddedProperties");
      } else {
        Swal.fire("No Changes", "Nothing was updated", "info");
      }
    },
    onError: () => {
      Swal.fire("Error", "Update failed", "error");
    },
  });

  const onSubmit = (data) => {
    if (!imageURL) {
      return Swal.fire("Error", "Please upload an image", "error");
    }

    const updatedProperty = {
      ...data,
      image: imageURL,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      status: "pending",
    };

    mutation.mutate(updatedProperty);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4 text-center">Update Property</h2>

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

        {/* Image Upload */}
        <div>
          <label className="label">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          {imageURL && (
            <img
              src={imageURL}
              alt="Preview"
              className="w-40 mt-2 rounded-lg border"
            />
          )}
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Minimum Price</label>
            <input
              type="number"
              {...register("priceMin", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.priceMin && (
              <p className="text-red-500">Minimum price required</p>
            )}
          </div>
          <div>
            <label className="label">Maximum Price</label>
            <input
              type="number"
              {...register("priceMax", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.priceMax && (
              <p className="text-red-500">Maximum price required</p>
            )}
          </div>
        </div>

        {/* Agent Info */}
        <div>
          <label className="label">Agent Name</label>
          <input
            type="text"
            value={property?.agentName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">Agent Email</label>
          <input
            type="text"
            value={property?.agentEmail}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" disabled={uploading} className="btn btn-primary w-full mt-4">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default UpdateProperty;
