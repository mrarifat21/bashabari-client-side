import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) => {
    signIn(email, password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back to Bashabari",
          background: "var(--color-background)",
          color: "var(--color-text)",
        });
        navigate(from);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message,
          background: "var(--color-background)",
          color: "var(--color-text)",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-surfaceColor shadow-lg border border-border rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-button mb-3">
          Login
        </h2>
        <p className="text-center text-text/70 mb-6">
          Welcome back to{" "}
          <span className="font-semibold text-highlight">Bashabari</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-button/40 transition"
            />
            {errors.email && (
              <p className="text-warning text-xs mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-button/40 transition"
            />
            {errors.password && (
              <p className="text-warning text-xs mt-1">
                Password is required
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 rounded-lg font-semibold text-base-100 bg-button hover:bg-button-hover transition-colors"
          >
            Login
          </button>

          {/* Register Redirect */}
          <p className="text-sm text-center text-text mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-button font-medium hover:underline"
            >
              Register here
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-grow h-px bg-border"></div>
            <span className="text-sm text-text/70">OR</span>
            <div className="flex-grow h-px bg-border"></div>
          </div>

          {/* Social Login */}
          <SocialLogin />
        </form>
      </div>
    </div>
  );
};

export default Login;
