import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const MakeOffer = () => {
  const property = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { register, handleSubmit, reset } = useForm();
  console.log(property);

  const onSubmit = async (data) => {
    const offerAmount = parseFloat(data.offerAmount);
    if (offerAmount < property.priceMin || offerAmount > property.priceMax) {
      Swal.fire({
        title: "Invalid",
        text: `Offer must be between $${property.priceMin} and $${property.priceMax}`,
        icon: "error",
        background: "#1C1C1C", 
        color: "#EAEAEA", 
      });
      return;
    }

    const offer = {
      propertyId: property._id,
      propertyImage: property.propertyImage,
      propertyTitle: property.propertyTitle,
      propertyLocation: property.propertyLocation,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      buyerName: user.displayName,
      buyerEmail: user.email,
      buyerImage: user.photoURL || "",
      offerAmount,
      buyingDate: data.buyingDate,
      priceMin: property.priceMin,
      priceMax: property.priceMax,
      status: "pending",
    };

    const res = await axiosSecure.post("/offers", offer);
    if (res.data.insertedId) {
      Swal.fire({
        title: "Success",
        text: "Your offer has been sent!",
        icon: "success",
        background: "#1C1C1C", // Base-100
        color: "#EAEAEA", // Base-content
      });
      reset();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 mt-8 bg-base-200 rounded-xl shadow-md border border-base-300 text-base-content">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">Make an Offer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="propertyTitle" className="label text-base-content">
            Property Title
          </label>
          <input
            id="propertyTitle"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            value={property.propertyTitle}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="propertyLocation" className="label text-base-content">
            Location
          </label>
          <input
            id="propertyLocation"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            value={property.propertyLocation}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="agentName" className="label text-base-content">
            Agent Name
          </label>
          <input
            id="agentName"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            value={property.agentName}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="buyerName" className="label text-base-content">
            Your Name
          </label>
          <input
            id="buyerName"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            value={user.displayName}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="buyerEmail" className="label text-base-content">
            Your Email
          </label>
          <input
            id="buyerEmail"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            value={user.email}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="offerAmount" className="label text-base-content">
            Offer Amount
          </label>
          <input
            id="offerAmount"
            type="number"
            placeholder={`Enter offer ($${property.priceMin} - $${property.priceMax})`}
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            {...register("offerAmount", { required: true })}
          />
        </div>

        <div>
          <label htmlFor="buyingDate" className="label text-base-content">
            Preferred Buying Date
          </label>
          <input
            id="buyingDate"
            type="date"
            className="input input-bordered w-full bg-base-100 text-base-content focus:border-primary focus:ring-2 focus:ring-primary/40 transition"
            {...register("buyingDate", { required: true })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-6 text-base-100">
          Send Offer
        </button>
      </form>
    </div>
  );
};

export default MakeOffer;
