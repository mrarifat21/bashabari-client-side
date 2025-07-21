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
  const { propertyID: propertyID } = useParams();
  console.log(propertyID);
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", propertyID],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${propertyID}`);
      return res.data;
    },
  });

  if (isPending) {
    return "Loading...";
  }

  console.log(parcelInfo);
  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    // step- 1: validate the card
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);

      // step-2: create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId: propertyID,
      });

      const clientSecret = res.data.clientSecret;

      // step-3: confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          const transactionId = result.paymentIntent.id;
          // step-4 mark parcel paid also create payment history
          const paymentData = {
            parcelId: propertyID,
            email: user.email,
            amount,
            transactionId: transactionId,
            paymentMethod: result.paymentIntent.payment_method_types,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);
          if (paymentRes.data.insertedId) {
            // ✅ Show SweetAlert with transaction ID
            await Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
              confirmButtonText: "Go to My Parcels",
            });

            // ✅ Redirect to /myParcels
            navigate("/dashboard/myParcels");
          }
        }
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
