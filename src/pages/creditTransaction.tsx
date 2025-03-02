/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Typography } from "@mui/material";

import TotalIncomeLightCard from "../../src/components/cards/TotalIncomeLightCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@nextui-org/button";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
const Transaction = ({ add }: any) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [profileLink, setProfileLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const handleAddCredit = async () => {
    await makePayment();

    // Logic to send or add the credits
    console.log(`Credits added: ${credits}`);
  };

  const handleSendCredit = async () => {
    setIsLoading(true);
    if (!user?.availableCredits) {
      return;
    }

    if (credits > user?.availableCredits) {
      toast({
        title: "Error",
        description: `Credits Cannot be greater than ${user?.availableCredits}`,
      });
      setIsLoading(false);
      return;
    }

    if (profileLink === user?.profileLink) {
      toast({
        title: "Error",
        description: `Profile link not correct`,
      });
      setIsLoading(false);
      return;
    }

    if (credits < 1 || profileLink.length < 5) {
      toast({
        title: "Error",
        description: `Please enter the data correctly`,
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        "https://sendcredit-5risxnudva-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            creditToSend: credits,
            profileLink: profileLink,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message,
        });
        console.log(result.message);
      } else {
        toast({
          title: "Error",
          description: result.message,
        });
        console.log(result.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error sending referral code:", error);
    }

    console.log(`Credits sent: ${credits}`);
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51L42JBBjhuRU5cGW2oXLq1IubYuai5huuBi0eMrODKEwvZDSe7KgTMWStEAxOVIcj9nPxWiaOvHEm7pEqhoa8vB400KVHlGKBY"
    );

    if (!stripe || !user) {
      return;
    }
    const apiUrl = "https://createcheckoutsession-5risxnudva-uc.a.run.app ";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credits: credits,
        userId: user.id,
        success_url: `${window.location.origin}/credit-tracker`,
        cancel_url: `${window.location.origin}/credit-tracker`,
      }),
    });

    const session = await response.json();
    const result = stripe.redirectToCheckout({ sessionId: session.sessionId });
    if (result) {
      console.log(result);
    }
  };
  return (
    <div
      className="flex flex-col justify-center items-center w-full bg-gray-200 border lg:flex-row lg:w-full "
      style={{ height: "100vh" }}
    >
      {/* Transaction Section */}
      <div
        className="flex flex-row justify-center items-center w-full  "
        style={{ marginTop: add ? "0vh" : "8vh" }}
      >
        <div className="w-full lg:w-1/2  justify-center items-center lg:mr-5 ">
          <div className="ml-9">
            <TotalIncomeLightCard
              isLoading={isLoading}
              user={user}
              buttons={false}
            />
          </div>
          <div className="w-full px-6 py-12 mx-5 mt-8 bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-center mb-12">
              <Typography
                variant="h4"
                className="text-2xl font-bold text-gray-800"
              >
                {add === true ? "Add Credits" : "Send Credits"}
              </Typography>
            </div>
            {/* Input Section */}
            <div className="flex flex-col items-center">
              <label className="block mb-2 text-lg font-semibold text-gray-800 hover:text-button-gpt transition duration-300">
                Number of Credits:
              </label>
              <div className="relative w-2/3">
                <input
                  type="number"
                  //   value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  placeholder="Enter credit amount"
                  className="w-full p-4 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-gpt focus:border-button-gpt transition duration-300 hover:shadow-lg"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                  💰
                </div>
              </div>
              {!add && (
                <>
                  <label className="block  mt-6 text-lg font-semibold text-gray-800 hover:text-button-gpt transition duration-300">
                    Profile Link:
                  </label>
                  <div className="relative w-2/3 mt-2">
                    <input
                      type="text"
                      value={profileLink}
                      onChange={(e) => setProfileLink(e.target.value)}
                      placeholder="Enter the profile link to send "
                      className="w-full p-4 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-gpt focus:border-button-gpt transition duration-300 hover:shadow-lg"
                    />
                  </div>
                </>
              )}
            </div>
            {/* Add Credit Button */}
            <div className="mt-6 flex justify-center">
              <div className="mt-8 mb-10">
                <Button
                  children={add ? "Add Credits" : "Send Credits"}
                  className="p-5 justify-center font-bold text-white hover:bg-button-gpt-hover bg-button-gpt"
                  isLoading={isLoading}
                  variant="faded"
                  type="submit"
                  onPress={add ? handleAddCredit : handleSendCredit}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Optional Payment Section */}
      </div>
    </div>
  );
};

export default Transaction;
