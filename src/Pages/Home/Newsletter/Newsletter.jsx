import React from 'react';
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Newsletter = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      title: "Subscribed!",
      text: "You will receive updates from Bashabari.",
      icon: "success",
      confirmButtonText: "OK",
      background: "#1C1C1C", // Set SweetAlert background to base-100 from the theme
      color: "#EAEAEA", // Set SweetAlert text color to base-content from the theme
    });
    reset();
  };

  return (
    <section className="bg-base-200 text-base-content py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3 text-primary">
          Subscribe to Our Newsletter
        </h2>
        <p className="mb-6 text-base-content">
          Get the latest property updates, offers, and Bashabari news straight to your inbox.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
            className="input input-bordered w-full max-w-xs bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
          />
          <button type="submit" className="btn btn-primary text-base-100">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
