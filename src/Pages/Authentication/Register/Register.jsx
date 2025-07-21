import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../SocialLogin/SocialLogin";

const Register = () => {
  const navigate = useNavigate();
  const { createUserWithEmail, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { name, email, password } = data;

    createUserWithEmail(email, password)
      .then(async (result) => {
        const userInfo = {
          name,
          email,
          role: "user",
          firebaseUid: result.user.uid,
          image: profilePic,
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);

        const userProfile = {
          displayName: name,
          photoURL: profilePic,
        };

        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile image update");
          })
          .catch((error) => {
            console.log("can not update profile image", error);
          });

        Swal.fire({
          icon: "success",
          title: "Registered Successfully!",
          text: "Welcome to Bashabari",
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message,
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_Image_Upload_Key
    }`;

    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
    } catch (err) {
      console.error("Image upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Please try again.",
        background: "#1C1C1C",
        color: "#EAEAEA",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 rounded-lg">
        <div className="card-body px-8 py-10">
          <h2 className="text-4xl font-extrabold text-center text-primary mb-8">
            Register
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Full Name"
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">Name is required</p>
            )}

            <input
              type="file"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full bg-base-200 text-base-content"
              accept="image/*"
            />

            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">Email is required</p>
            )}

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/,
                  message:
                    "Password must include a capital letter and a special character",
                },
              })}
              placeholder="Password"
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full mt-4 text-base-100 font-semibold"
            >
              Register
            </button>

            <p className="text-sm text-center text-base-content mt-6">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-medium">
                Login here
              </Link>
            </p>

            <div className="divider text-base-content">OR</div>
            <SocialLogin />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
