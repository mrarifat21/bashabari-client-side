import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

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
      Swal.fire("Removed!", "Property removed from wishlist", "success");
    },
  });

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-base-100 p-4 shadow-md rounded-xl flex flex-col border border-gray-300"
          >
            <img
              src={item.propertyImage}
              className="w-full h-48 object-cover rounded-lg"
              alt="property"
            />
            <h3 className="text-lg font-semibold mt-2">{item.propertyTitle}</h3>
            <p className="text-sm text-gray-600">{item.propertyLocation}</p>
            <p className="text-sm">💰 ${item.priceMin} - ${item.priceMax}</p>
            <div className="flex items-center gap-2 mt-1">
              <img
                src={item.agentImage}
                className="w-7 h-7 rounded-full"
                alt="agent"
              />
              <span className="text-sm">{item.agentName}</span>
              {item.propertyStatus === "verified" && (
                <span className="badge badge-success badge-sm">Verified</span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Link to={`/dashboard/make-offer/${item._id}`}>
                <button className="btn btn-primary btn-sm">Make Offer</button>
              </Link>
              <button
                onClick={() => handleRemove(item._id)}
                className="btn btn-error btn-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
