import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import profilePlaceholder from "./../../assets/profilePlaceholder.jpg";
import PropertyReviews from "./PropertyReviews";
import AddReviewModal from "./AddReviewModal";
import AddToWishlistButton from "./AddtoWishlistButton";

const PropertyDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();

  const { data: property, isLoading } = useQuery({
    queryKey: ["propertyDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/properties/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-xl text-base-content bg-base-100 py-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 bg-base-200 rounded-xl shadow-lg mt-6 sm:mt-10 text-base-content">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-primary text-center sm:text-left">
        {property.title}
      </h2>

      <img
        src={property.image}
        alt={property.title}
        className="w-full h-72 md:h-[400px] object-cover rounded-lg shadow-md"
      />

      <p className="text-lg leading-relaxed text-justify">{property.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-4 sm:p-6 rounded-lg shadow-inner">
        <p>
          <strong className="text-primary">📍 Location:</strong> {property.location}
        </p>
        <p>
          <strong className="text-primary">💰 Price Range:</strong> ${property.priceMin} - ${property.priceMax}
        </p>
        <div className="flex items-center gap-3 col-span-1 md:col-span-2 flex-wrap">
          <strong className="text-primary">👤 Agent:</strong>
          <img
            src={property.agentImage || profilePlaceholder}
            alt="Agent"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
          />
          <span className="font-medium">{property.agentName}</span>
        </div>
      </div>

      <div className="mt-4">
        <AddToWishlistButton property={property} />
      </div>

      <section className="bg-base-100 p-4 sm:p-6 rounded-lg shadow-inner space-y-4">
        <h3 className="text-2xl font-semibold text-primary">Reviews</h3>
        <PropertyReviews propertyId={property._id} />
        <AddReviewModal
          propertyId={property._id}
          agentName={property.agentName}
          propertyTitle={property.title}
        />
      </section>
    </main>
  );
};

export default PropertyDetails;
