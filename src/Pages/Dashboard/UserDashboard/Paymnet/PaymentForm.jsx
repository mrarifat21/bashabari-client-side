import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { propertyID } = useParams(); // This is offer ID here
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isLoading, data: offer = {} } = useQuery({
    queryKey: ["offer", propertyID],
    queryFn: async () => {
      const res = await axiosSecure.get(`/offer/${propertyID}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p>Loading offer data...</p>;
  }

  // Safely extract amount from offerAmount field, convert to number if needed
  const amount =
    offer.offerAmount && typeof offer.offerAmount === "object" && "$numberInt" in offer.offerAmount
      ? parseInt(offer.offerAmount.$numberInt)
      : Number(offer.offerAmount) || 0;
console.log(offer);
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    // Step 1: create payment method
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      return;
    }

    setError("");

    // Step 2: create payment intent on backend
    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      offerId: propertyID, // send offer id for backend record if needed
    });

    const clientSecret = res.data.clientSecret;

    // Step 3: confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setError("");

    if (result.paymentIntent.status === "succeeded") {
      const transactionId = result.paymentIntent.id;

      // Step 4: record payment info in backend (optional)
      const paymentData = {
        offerId: propertyID,
        email: user.email,
        amount,
        transactionId,
        paymentMethod: result.paymentIntent.payment_method_types,
      };

      const paymentRes = await axiosSecure.post("/payments", paymentData);

      if (paymentRes.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
          confirmButtonText: "Go to My Offers",
        });

        navigate("/dashboard/propertyBought");
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded" />
        <button type="submit" className="btn btn-primary text-black w-full" disabled={!stripe}>
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
