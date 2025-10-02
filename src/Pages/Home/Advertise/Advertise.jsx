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
      <div className="flex justify-center items-center py-20 bg-background transition-colors duration-300">
        <span className="loading loading-spinner text-button"></span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-warning font-semibold py-10 bg-background transition-colors duration-300">
        Failed to load advertised properties.
      </div>
    );

  return (
    <section className="bg-background">
      <div className="w-11/12 mx-auto sm:px-6  py-12  text-text transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-button mb-10">
          Featured Properties
        </h2>

        {advertisedProperties.length === 0 ? (
          <p className="text-center text-text/80">
            No advertised properties found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {advertisedProperties.map((property) => (
              <div
                key={property._id}
                className="bg-surfaceColor rounded-2xl shadow-lg border border-border overflow-hidden transition-transform transform hover:scale-105 duration-300"
              >
                <figure>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="p-4">
                  <h3 className="font-semibold text-text mb-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-text/80 mb-1">
                    <span className="font-medium">Location:</span>{" "}
                    {property.location}
                  </p>
                  <p className="text-sm text-text/80 mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    {property.status}
                  </p>
                  <p className="text-sm text-text/80 mb-3">
                    <span className="font-medium">Price:</span> $
                    {property.priceMin} - ${property.priceMax}
                  </p>
                  <Link
                    to={`/property/${property._id}`}
                    className="w-full inline-block text-center py-2 rounded-lg bg-button hover:bg-button-hover text-text font-semibold transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Advertise;
