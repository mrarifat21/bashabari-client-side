import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; // Changed from 'react-router' to 'react-router-dom' for consistency
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    signIn(email, password)
      .then((result) => {
        // console.log("Logged in user:", result.user);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back to Bashabari",
          background: "#1C1C1C", // Set SweetAlert background to base-100 from the theme
          color: "#EAEAEA", // Set SweetAlert text color to base-content from the theme
        });

        navigate("/"); // redirect to home
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message,
          background: "#1C1C1C", // Set SweetAlert background to base-100 from the theme
          color: "#EAEAEA", // Set SweetAlert text color to base-content from the theme
        });
      });
  };

  return (
    // Main container: min-height for full screen, flexbox for centering, background set to base-200 (dark gray)
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      {/* Card container: max-width for responsiveness, background set to base-100 (darkest), shadow, border using base-300, rounded corners */}
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300 rounded-lg">
        <div className="card-body">
          {/* Heading: text color set to primary (muted gold/bronze) */}
          <h2 className="text-4xl font-extrabold text-center text-primary mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              // Input styling: background base-200, text base-content, focus border primary, focus ring primary/40
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.email && (
              // Error message: text color set to error
              <p className="text-error text-sm mt-1">Email is required</p>
            )}

            {/* Password Input */}
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              // Input styling: background base-200, text base-content, focus border primary, focus ring primary/40
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.password && (
              // Error message: text color set to error
              <p className="text-error text-sm mt-1">Password is required</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              // Button styling: btn-primary (picks up theme primary color), text base-100 (darkest background for contrast on primary)
              className="btn btn-primary w-full mt-4 text-base-100 font-semibold"
            >
              Login
            </button>

            {/* "Don't have an account?" text: text color set to base-content */}
            <p className="text-sm text-center text-base-content mt-4">
              Don’t have an account?{" "}
              {/* Register link: link-primary (picks up theme primary color) */}
              <Link to="/register" className="link link-primary font-medium">
                Register here
              </Link>
            </p>

            {/* Divider: text color set to base-content */}
            <div className="divider text-base-content">OR</div>
            <SocialLogin />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
