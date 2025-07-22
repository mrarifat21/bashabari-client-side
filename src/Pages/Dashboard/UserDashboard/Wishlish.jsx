import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

const Wishlist = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/wishlist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist", user?.email]);
      Swal.fire({
        title: "Removed!",
        text: "Property removed from wishlist",
        icon: "success",
        background: "#1C1C1C",
        color: "#EAEAEA",
      });
    },
  });

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, remove it!",
      background: "#1C1C1C",
      color: "#EAEAEA",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire({
              title: "Removed!",
              text: "The item has been successfully removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              background: "#1C1C1C",
              color: "#EAEAEA",
              timerProgressBar: true,
            });
          },
        });
      }
    });
  };

  if (isLoading)
    return (
      <div className="text-center py-20 bg-base-100 text-base-content text-lg font-semibold">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-base-100 min-h-screen text-base-content">
      <h2 className="text-3xl font-bold mb-6 text-primary">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-center text-base-content/70">
          No properties in your wishlist.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-base-200 p-4 shadow-md rounded-xl flex flex-col border border-base-300 text-base-content"
            >
              <img
                src={item.propertyImage}
                className="w-full h-48 object-cover rounded-lg"
                alt="property"
              />
              <h3 className="text-lg font-semibold mt-2 text-primary">
                {item.propertyTitle}
              </h3>
              <p className="text-sm text-base-content/80">
                {item.propertyLocation}
              </p>
              <p className="text-sm text-base-content">
                💰 ${item.priceMin} - ${item.priceMax}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={item.agentImage}
                  className="w-7 h-7 rounded-full border border-primary"
                  alt="agent"
                />
                <span className="text-sm text-base-content">
                  {item.agentName}
                </span>
                {item.propertyStatus === "verified" && (
                  <span className="text-success text-sm font-bold">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Link to={`/dashboard/make-offer/${item._id}`}>
                  <button className="btn btn-primary btn-sm text-base-100 border-0">
                    Make Offer
                  </button>
                </Link>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="btn btn-error btn-sm text-white border-0"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
