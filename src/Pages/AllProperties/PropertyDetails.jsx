import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import profilePlaceholder from "./../../assets/profilePlaceholder.jpg";
import AddToWishlistButton from "./AddtoWishlistButton";
import PropertyReviews from "./PropertyReviews";
import AddReviewModal from "./AddReviewModal";

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
      <div className="text-center mt-10 text-xl text-secondary-content">
        Loading property...
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 bg-base-200 rounded-xl shadow-lg mt-6">
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-primary">{property.title}</h2>

      {/* Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-72 object-cover rounded-lg shadow-md"
      />

      {/* Description */}
      <p className="text-base-content text-lg leading-relaxed">
        {property.description}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-base-100 p-6 rounded-lg shadow-inner">
        <p className="text-base-content">
          <strong className="">📍 Location:</strong>{" "}
          {property.location}
        </p>
        <p className="text-base-content">
          <strong className="">💰 Price Range:</strong> ${property.priceMin} - ${property.priceMax}
        </p>
        <div className="flex items-center gap-3 col-span-2 mt-2">
          <strong className="">👤 Agent:</strong>
          <img
            src={property.agentImage || profilePlaceholder}
            alt="Agent"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
          />
          <span className="text-base-content font-medium">
            {property.agentName}
          </span>
        </div>
      </div>

      {/* Wishlist Button */}
      <div className="mt-4">
        <AddToWishlistButton property={property} />
      </div>

      {/* Reviews Section */}
      <section className="bg-base-100 p-6 rounded-lg shadow-inner space-y-4">
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
