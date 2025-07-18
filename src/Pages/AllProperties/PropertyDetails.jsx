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
    return <div className="text-center mt-10 text-xl">Loading property...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-primary">{property.title}</h2>

      <img
        src={property.image}
        alt={property.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <p className="text-lg  mb-4">{property.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm ">
        <p>
          <strong>Location:</strong> {property.location}
        </p>
        <p>
          <strong>Price Range:</strong> ${property.priceMin} - $
          {property.priceMax}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <strong>Agent:</strong>
          <img
            src={property.agentImage || profilePlaceholder}
            alt="Agent"
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span>{property.agentName}</span>
        </div>
      </div>

      {/* Add to Wishlist */}
      <AddToWishlistButton property={property} />

      {/* Property Reviews */}
      <PropertyReviews propertyId={property._id} />
      {/* Add Review Button */}
      <AddReviewModal propertyId={property._id} />
    </main>
  );
};

export default PropertyDetails;
