// import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { useState } from "react";
// import { db } from "@/lib/firebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
// import Button from "@/components/button";
// import { useAuth } from "../hooks/useAuth";
// const cardStyle = {
//   style: {
//     base: {
//       fontSize: "16px",
//       color: "#32325d",
//       "::placeholder": {
//         color: "#aab7c4",
//       },
//     },
//     invalid: {
//       color: "#fa755a",
//     },
//   },
// };
// const SetupAutoPay = () => {
//   const { user } = useAuth();
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSetupIntent = async () => {
//     setLoading(true);

//     if (!stripe || !elements || !user) {
//       alert("Stripe has not loaded yet.");
//       return;
//     }

//     const response = await fetch(
//       "https://createsetupintent-5risxnudva-uc.a.run.app",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({  }),
//       }
//     );

//     const session = await response.json();
//     const clientSecret = session.clientSecret;

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) {
//       alert("Card element not found!");
//       setLoading(false);
//       return;
//     }

//     const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
//       payment_method: { card: cardElement },
//     });

//     if (error) {
//       console.error("Setup Intent failed:", error);
//       alert("Failed to set up AutoPay. Try again.");
//       setLoading(false);
//       return;
//     }

//     await updateDoc(userRef, {
//       defaultPaymentMethod: setupIntent.payment_method,
//     });

//     alert("AutoPay setup successfully!");
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
//       <h2 className="text-lg font-bold mb-3">Enter Your Card Details</h2>

//       {/* Styled CardElement Container */}
//       <div className="w-full border border-gray-300 p-3 rounded-lg shadow-sm">
//         <CardElement options={cardStyle} />
//       </div>

//       <Button
//         onClick={handleSetupIntent}
//         disabled={loading}
//         className="mt-4 w-full bg-button-gpt text-white py-2 rounded-md"
//       >
//         {loading ? "Processing..." : "Enable AutoPay"}
//       </Button>
//     </div>
//   );
// };

// export default SetupAutoPay;
