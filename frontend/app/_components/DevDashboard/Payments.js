"use client";

import { useRouter } from "next/navigation";

const Payments = () => {
  const router = useRouter();

  const initiatePayment = async () => {
    try {
      const response = await fetch("/api/create-mobilepay-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100, // Amount in the smallest currency unit
          currency: "DKK",
          // Additional payment details
        }),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed.");
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl; // Redirect user to MobilePay
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div className="flex flex-col md:gap-6 gap-4 my-4 p-4 mx-auto max-w-4xl">
      <button
        onClick={initiatePayment}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Create Payment with MobilePay
      </button>
    </div>
  );
};

export default Payments;
