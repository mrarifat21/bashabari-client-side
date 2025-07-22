import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const AddProperty = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [isFraud, setIsFraud] = useState(false); // NEW: fraud status

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const priceMin = watch("priceMin");
  const priceMax = watch("priceMax");

  // 🔎 Check if user is fraud
  useEffect(() => {
    const checkFraudStatus = async () => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/users/${user.email}`);
          if (res.data?.status === "fraud") {
            setIsFraud(true);
          }
        } catch (err) {
          console.error("Failed to fetch user info", err);
        }
      }
    };
    checkFraudStatus();
  }, [user?.email, axiosSecure]);

  const onSubmit = async (data) => {
    if (isFraud) {
      return Swal.fire(
        "Access Denied",
        "Fraud agents cannot add properties.",
        "error"
      );
    }

    if (parseFloat(data.priceMin) > parseFloat(data.priceMax)) {
      return Swal.fire(
        "Validation Error",
        "Minimum price cannot be greater than Maximum price",
        "error"
      );
    }

    if (!imageURL) {
      return Swal.fire("Upload Failed", "Image not uploaded", "error");
    }

    const property = {
      title: data.title,
      location: data.location,
      image: imageURL,
      description: data.description,
      priceMin: parseFloat(data.priceMin),
      priceMax: parseFloat(data.priceMax),
      agentName: user?.displayName,
      agentEmail: user?.email,
      agentImage: user?.photoURL,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/properties", property);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Success!", "Property added successfully", "success");
        reset();
        setImageURL("");
      } else {
        Swal.fire("Error!", "Could not add property", "error");
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

  // 🚫 UI for fraud agents
  if (isFraud) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center bg-red-100 border border-red-400 mt-10 rounded-lg">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2 text-red-500">
          Your account has been marked as <strong>fraud</strong> by the admin.
          You are not allowed to add new properties.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-lg shadow my-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Add New Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ... (keep your form code as is here) */}
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
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          {imageURL && (
            <img
              src={imageURL}
              alt="preview"
              className="w-40 mt-2 rounded-lg border"
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
        {/* description */}
        <div>
          <label className="label">Property Description</label>
          <textarea
            cols={3}
            type="text"
            placeholder="Description"
            {...register("description", { required: true })}
            className="input input-bordered w-full"
          />
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </div>

        {/* Agent Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Agent Name</label>
            <input
              type="text"
              value={user?.displayName || ""}
              className="input input-bordered w-full"
              readOnly
            />
          </div>
          <div>
            <label className="label">Agent Email</label>
            <input
              type="text"
              value={user?.email || ""}
              className="input input-bordered w-full"
              readOnly
            />
          </div>
        </div>

        <button className="btn btn-primary w-full mt-4 border-0" disabled={uploading}>
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
