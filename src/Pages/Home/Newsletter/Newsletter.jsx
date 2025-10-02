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
      background: "#1C1C1C", 
      color: "#EAEAEA", 
    });
    reset();
  };

  return (
    <section className="bg-background text-text py-12 px-4 transition-colors duration-300">
      <div className="w-11/12 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-button">
          Subscribe to Our Newsletter
        </h2>
        <p className="mb-6 text-text/80">
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
            className="input input-bordered w-full max-w-xs bg-surfaceColor text-text border border-border focus:border-button focus:ring-2 focus:ring-button/40 rounded-lg transition"
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto py-2 px-6 rounded-lg bg-button hover:bg-button-hover text-text font-semibold transition-colors duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
