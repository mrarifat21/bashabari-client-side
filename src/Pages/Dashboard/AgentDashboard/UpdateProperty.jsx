import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";



const UpdateProperty = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageURL, setImageURL] = useState("");
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        location: property.location,
        priceMin: property.priceMin,
        priceMax: property.priceMax,
      });
      setImageURL(property.image);
    }
  }, [property, reset]);

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
      Swal.fire({
        title: "Error",
        text: "Image upload failed",
        icon: "error",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(`/properties/${id}`, updatedData),
    onSuccess: (res) => {
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Success",
          text: "Property updated",
          icon: "success",
          background: "#1C1C1C", // Base-100
          color: "#EAEAEA", // Base-content
        });
        queryClient.invalidateQueries(["property", id]);
        navigate("/dashboard/myAddedProperties");
      } else {
        Swal.fire({
          title: "No Changes",
          text: "Nothing was updated",
          icon: "info",
          background: "#1C1C1C", // Base-100
          color: "#EAEAEA", // Base-content
        });
      }
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Update failed",
        icon: "error",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
    },
  });

  const onSubmit = (data) => {
    if (!imageURL) {
      return Swal.fire({
        title: "Error",
        text: "Please upload an image",
        icon: "error",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
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

  if (isLoading) return <div className="text-center mt-10 text-base-content bg-base-100 py-20"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow border border-base-300 text-base-content">
      <h2 className="text-3xl font-bold mb-4 text-center text-primary">Update Property</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label text-base-content">Property Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
          />
          {errors.title && <p className="text-error">Title is required</p>}
        </div>

        <div>
          <label className="label text-base-content">Location</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
          />
          {errors.location && (
            <p className="text-error">Location is required</p>
          )}
        </div>

        <div>
          <label className="label text-base-content">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full bg-base-100 text-base-content"
          />
          {uploading && <p className="text-accent">Uploading image...</p>}
          {imageURL && (
            <img
              src={imageURL}
              alt="Preview"
              className="w-40 mt-2 rounded-lg border border-base-300"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label text-base-content">Minimum Price</label>
            <input
              type="number"
              {...register("priceMin", { required: true })}
              className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.priceMin && (
              <p className="text-error">Minimum price required</p>
            )}
          </div>
          <div>
            <label className="label text-base-content">Maximum Price</label>
            <input
              type="number"
              {...register("priceMax", { required: true })}
              className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.priceMax && (
              <p className="text-error">Maximum price required</p>
            )}
          </div>
        </div>

        <div>
          <label className="label text-base-content">Agent Name</label>
          <input
            type="text"
            value={property?.agentName}
            readOnly
            className="input input-bordered w-full bg-base-100 text-base-content"
          />
        </div>
        <div>
          <label className="label text-base-content">Agent Email</label>
          <input
            type="text"
            value={property?.agentEmail}
            readOnly
            className="input input-bordered w-full bg-base-100 text-base-content"
          />
        </div>

        <button type="submit" disabled={uploading} className="btn btn-primary w-full mt-4 text-base-100">
          Update Property
        </button>
      </form>
    </div>
  );
};

export default UpdateProperty;
