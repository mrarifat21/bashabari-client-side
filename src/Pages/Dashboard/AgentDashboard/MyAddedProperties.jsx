import React from "react";
import profilePlaceholder from "./../../../assets/profilePlaceholder.jpg";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const MyAddedProperties = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["myProperties", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/properties/agent?email=${user.email}`
      );
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/properties/${id}`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      if (data.deletedCount > 0) {
        Swal.fire({
          title: "Deleted!",
          text: "Property has been deleted.",
          icon: "success",
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
        queryClient.invalidateQueries(["myProperties", user?.email]);
      } else {
        Swal.fire({
          title: "Failed!",
          text: "Property could not be deleted. Try again later.",
          icon: "error",
          background: "#1C1C1C",
          color: "#EAEAEA",
        });
      }
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Something went wrong while deleting the property.",
        icon: "error",
        background: "#1C1C1C",
        color: "#EAEAEA",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      background: "#1C1C1C",
      color: "#EAEAEA",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading)
    return (
      <div className="text-center my-10 text-text bg-base-100 font-semibold text-lg">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  return (
    <section className="bg-background">
      <div className="p-4 max-w-7xl mx-auto min-h-screen text-text">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          My Added Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property._id}
              className="card bg-surfaceColor shadow-md hover:shadow-xl transition duration-300 rounded-lg border border-border flex flex-col text-text"
            >
              <figure className="overflow-hidden rounded-t-lg">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-56 w-full object-cover transform hover:scale-105 transition duration-300"
                />
              </figure>

              <div className="card-body flex flex-col flex-grow p-4">
                <h2
                  className="card-title text-lg font-semibold truncate text-primary"
                  title={property.title}
                >
                  {property.title}
                </h2>

                <p className="text-sm mt-1 text-text/80">
                  <strong>Location:</strong> {property.location}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <strong className="text-text/80">Agent:</strong>
                  <img
                    src={property.agentImage || profilePlaceholder}
                    alt="Agent"
                    className="w-9 h-9 rounded-full object-cover border border-primary"
                  />
                  <span className="text-sm truncate" title={property.agentName}>
                    {property.agentName}
                  </span>
                </div>

                <p className="text-sm mt-3">
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 font-extrabold ${
                      property.status === "verified"
                        ? "text-highlight"
                        : property.status === "rejected"
                        ? "text-red-600"
                        : "text-warning"
                    }`}
                  >
                    {property.status}
                  </span>
                </p>

                <p className="text-sm mt-2 text-text/80">
                  <strong>Price Range:</strong> ${property.priceMin} - $
                  {property.priceMax}
                </p>

                <div className="mt-auto flex flex-wrap gap-3 justify-center sm:justify-start">
                  {property.status !== "rejected" && (
                    <Link
                      to={`/dashboard/updateProperty/${property._id}`}
                      className="w-full sm:w-auto"
                    >
                      <button className="btn btn-sm bg-accent border-0 text-text w-full sm:w-auto px-6 py-2 rounded-md font-semibold">
                        Update
                      </button>
                    </Link>
                  )}
                  <button
                    className="btn btn-sm btn-warning w-full sm:w-auto px-6 py-2 rounded-md font-semibold text-text border-0"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyAddedProperties;
