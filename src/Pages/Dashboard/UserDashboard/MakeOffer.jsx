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
console.log(property.title);
  const onSubmit = async (data) => {
    const offerAmount = parseFloat(data.offerAmount);
    if (offerAmount < property.priceMin || offerAmount > property.priceMax) {
      Swal.fire("Invalid", `Offer must be between $${property.priceMin} and $${property.priceMax}`, "error");
      return;
    }

    const offer = {
      propertyId: property.propertyId,
      propertyImage: property.image,
      propertyTitle: property.propertyTitle,
      propertyLocation: property.propertyLocation,
      agentName: property.agentName,
      buyerName: user.name,
      buyerEmail: user.email,
      buyerImage: user.image || "",
      offerAmount,
      buyingDate: data.buyingDate,
      priceMin: property.priceMin,
      priceMax: property.priceMax,
      status: "pending",
    };

    const res = await axiosSecure.post("/offers", offer);
    if (res.data.insertedId) {
      Swal.fire("Success", "Your offer has been sent!", "success");
      reset();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Make an Offer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label htmlFor="propertyTitle" className="label">Property Title</label>
          <input id="propertyTitle" className="input input-bordered w-full" value={property.propertyTitle} readOnly />
        </div>

        <div>
          <label htmlFor="propertyLocation" className="label">Location</label>
          <input id="propertyLocation" className="input input-bordered w-full" value={property.propertyLocation} readOnly />
        </div>

        <div>
          <label htmlFor="agentName" className="label">Agent Name</label>
          <input id="agentName" className="input input-bordered w-full" value={property.agentName} readOnly />
        </div>

        <div>
          <label htmlFor="buyerName" className="label">Your Name</label>
          <input id="buyerName" className="input input-bordered w-full" value={user.displayName} readOnly />
        </div>

        <div>
          <label htmlFor="buyerEmail" className="label">Your Email</label>
          <input id="buyerEmail" className="input input-bordered w-full" value={user.email} readOnly />
        </div>

        <div>
          <label htmlFor="offerAmount" className="label">Offer Amount</label>
          <input
            id="offerAmount"
            type="number"
            placeholder={`Enter offer ($${property.priceMin} - $${property.priceMax})`}
            className="input input-bordered w-full"
            {...register("offerAmount", { required: true })}
          />
        </div>

        <div>
          <label htmlFor="buyingDate" className="label">Preferred Buying Date</label>
          <input
            id="buyingDate"
            type="date"
            placeholder="Select date"
            className="input input-bordered w-full"
            {...register("buyingDate", { required: true })}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">Send Offer</button>
      </form>
    </div>
  );
};

export default MakeOffer;
