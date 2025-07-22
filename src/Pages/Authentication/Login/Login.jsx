import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location =useLocation();
  const from = location.state?. from || '/'

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
          background: "#1C1C1C",
          color: "#EAEAEA",
        });

        navigate(from);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message,
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-300 rounded-lg">
        <div className="card-body">
          <h2 className="text-4xl font-extrabold text-center text-primary mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">Email is required</p>
            )}

            {/* Password Input */}
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">Password is required</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4 text-base-100 font-semibold"
            >
              Login
            </button>
            <p className="text-sm text-center text-base-content mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="link link-primary font-medium">
                Register here
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

export default Login;
