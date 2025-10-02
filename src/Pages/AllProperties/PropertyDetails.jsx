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
      <div className="flex justify-center items-center mt-16">
        <span className="loading loading-spinner text-primary text-4xl"></span>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 sm:p-10 space-y-10 mt-8 sm:mt-12 text-text">
      {/* Title */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-primary text-center sm:text-left">
        {property.title}
      </h2>

      {/* Image */}
      <div className="w-full h-80 md:h-[500px] overflow-hidden rounded-lg">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Description */}
      <p className="text-lg sm:text-xl leading-relaxed text-justify">
        {property.description}
      </p>

      {/* Property Info */}
      <div className="space-y-2 text-lg sm:text-xl">
        <p>
          <strong className="text-primary">Location:</strong> {property.location}
        </p>
        <p>
          <strong className="text-primary">Price Range:</strong> ${property.priceMin} - ${property.priceMax}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <strong className="text-primary">Agent:</strong>
          {/* <img
            src={property.agentImage || profilePlaceholder}
            alt="Agent"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
          /> */}
          <span className="font-medium">{property.agentName}</span>
        </div>
      </div>

      {/* Wishlist Button */}
      <div className="mt-4">
        <AddToWishlistButton property={property} />
      </div>

      {/* Reviews Section */}
      <section className="space-y-6">
        <h3 className="text-3xl font-semibold text-primary text-center sm:text-left">
          Reviews
        </h3>
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
