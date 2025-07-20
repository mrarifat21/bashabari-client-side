import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router";
import useAxios from "../../../hooks/useAxios";

const Advertise = () => {
  const axiosSecure = useAxios();

  const { data: advertisedProperties = [], isLoading, error } = useQuery({
    queryKey: ["advertisedProperties"],
    queryFn: async () => {
      const res = await axiosSecure.get("/properties/advertised");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading advertised properties...</p>;
  if (error) return <p>Failed to load advertised properties.</p>;
  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center my-20">Featured Properties</h2>
      {advertisedProperties.length === 0 ? (
        <p>No advertised properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advertisedProperties.map((property) => (
            <div
              key={property._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
            >
              <figure>
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg">{property.title}</h3>
                <p className="text-sm ">Location:{property.location}</p>
                <p className="text-sm text-gray-300 ">Status: {property.status}</p>
                <p className="text-sm mt-1">
                  Price: ${property.priceMin} - ${property.priceMax}
                </p>
                <Link
                  to={`/property/${property._id}`}
                  className="btn btn-primary btn-sm mt-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Advertise;
