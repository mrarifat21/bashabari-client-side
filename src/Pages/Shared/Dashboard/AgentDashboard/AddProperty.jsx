import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth";
// import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../../../hooks/useAxios";

const AddProperty = () => {
  const { user } = useAuth();
  // const axiosSecure = useAxiosSecure();
  const axiosSecure = useAxios();
  
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!imageURL) {
      return Swal.fire("Upload Failed", "Image not uploaded", "error");
    }

    const property = {
      title: data.title,
      location: data.location,
      image: imageURL,
      priceMin: parseFloat(data.priceMin),
      priceMax: parseFloat(data.priceMax),
      agentName: user?.displayName,
      agentEmail: user?.email,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/properties", property);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Property added successfully", "success");
        reset();
        setImageURL("");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  const handleImageUpload = async (e) => {
    setUploading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    try {
      const imgBBKey = import.meta.env.VITE_Image_Upload_Key;
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
        formData
      );
      const url = res.data.data.url;
      setImageURL(url);
    } catch (err) {
      console.error("Image upload failed", err);
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="label">Property Title</label>
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}
        </div>

        {/* Location */}
        <div>
          <label className="label">Property Location</label>
          <input
            type="text"
            placeholder="Location"
            {...register("location", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.location && (
            <p className="text-red-500">Location is required</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">Upload Property Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          {imageURL && (
            <img
              src={imageURL}
              alt="preview"
              className="w-40 mt-2 rounded-lg"
            />
          )}
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Minimum Price</label>
            <input
              type="number"
              step="any"
              {...register("priceMin", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.priceMin && <p className="text-red-500">Required</p>}
          </div>
          <div>
            <label className="label">Maximum Price</label>
            <input
              type="number"
              step="any"
              {...register("priceMax", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.priceMax && <p className="text-red-500">Required</p>}
          </div>
        </div>

        {/* Agent Info (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Agent Name</label>
            <input
              type="text"
              defaultValue={user?.displayName}
              className="input input-bordered w-full "
              readOnly
            />
          </div>
          <div>
            <label className="label">Agent Email</label>
            <input
              type="text"
              defaultValue={user?.email}
              className="input input-bordered w-full"
              readOnly
            />
          </div>
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-full" disabled={uploading}>
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
