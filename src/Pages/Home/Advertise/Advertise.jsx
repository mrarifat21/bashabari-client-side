import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; 
import useAxios from "../../../hooks/useAxios";

const Advertise = () => {
  const axiosSecure = useAxios();

  const {
    data: advertisedProperties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["advertisedProperties"],
    queryFn: async () => {
      const res = await axiosSecure.get("/properties/advertised");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        Failed to load advertised properties.
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-10">
        🌟 Featured Properties
      </h2>

      {advertisedProperties.length === 0 ? (
        <p className="text-center text-base-content">No advertised properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {advertisedProperties.map((property) => (
            <div
              key={property._id}
              className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 transition-all duration-300"
            >
              <figure>
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
              </figure>
              <div className="card-body text-base-content">
                <h3 className="card-title text-lg font-semibold">
                  {property.title}
                </h3>
                <p className="text-sm opacity-90">
                  <span className="font-medium">📍 Location:</span>{" "}
                  {property.location}
                </p>
                <p className="text-sm opacity-90">
                  <span className="font-medium">📌 Status:</span>{" "}
                  {property.status}
                </p>
                <p className="text-sm opacity-90">
                  <span className="font-medium">💰 Price:</span> $
                  {property.priceMin} - ${property.priceMax}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/property/${property._id}`}
                    className="btn btn-primary btn-sm w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Advertise;
