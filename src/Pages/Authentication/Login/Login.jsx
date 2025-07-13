import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
        console.log("Logged in user:", result.user);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back to Bashabari",
        });

        navigate("/"); // redirect to home
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message,
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-error text-sm">Email is required</p>
            )}

            {/* Password */}
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-error text-sm">Password is required</p>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register here
              </Link>
            </p>

            <div className="divider">OR</div>
            <SocialLogin />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
