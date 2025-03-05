/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Button as MuiButton,
  Modal,
  TextField,
  Fade,
} from "@mui/material";
import CurrencyFormat from "react-currency-format";
import { Button } from "@nextui-org/button";

import { useBillPaymentContext } from "@/context/paymentBillsContext";
import { useAuth } from "@/context/AuthContext";
import { DateTime } from "luxon";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const Transaction = () => {
  const { toast } = useToast();
  const { user }: any = useAuth();
  const { selectedBills, removeBill, clearBills, calculateTotalBills } =
    useBillPaymentContext();
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(
    user?.availableCredits || 0
  );
  console.log(setAvailableCredits);
  const [creditInput, setCreditInput] = useState(0);
  const [creditApplied, setCreditApplied] = useState(0);

  useEffect(() => {
    setVisibleItems(selectedBills);
  }, [selectedBills]);
  const savingsForBill = useMemo(() => {
    if (visibleItems.length > 0) {
      return calculateSavingsForBills(user, visibleItems);
    } else {
      return {
        totalSavings: 0,
        unifiedDueDate: "",
        percentageApplied: 0,
      };
    }
  }, [user, visibleItems]);
  const subtotal = calculateTotalBills();
  const discount = savingsForBill.totalSavings;
  const total = useMemo(() => {
    return subtotal - creditApplied;
  }, [subtotal, creditApplied]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleApplyCredits = () => {
    if (creditInput > availableCredits) {
      toast({
        title: "Warning",
        description: "You cannot apply more credits than available!",
      });
    } else if (creditInput > subtotal) {
      toast({
        title: "Warning",
        description: "Credits cannot exceed the subtotal!",
      });
    } else {
      setCreditApplied(creditInput);
      // setAvailableCredits(availableCredits - creditInput);
      handleCloseModal();
    }
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51L42JBBjhuRU5cGW2oXLq1IubYuai5huuBi0eMrODKEwvZDSe7KgTMWStEAxOVIcj9nPxWiaOvHEm7pEqhoa8vB400KVHlGKBY"
    );
    if (!stripe) {
      return;
    }
    const apiUrl = "https://createbillscheckoutsession-5risxnudva-uc.a.run.app";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionType: "billsPayment",
        creditApplied: creditApplied,
        userId: user?.id,
        visibleItems: visibleItems,
        subtotal: subtotal,
        savings: discount,
        total: total,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/dashboard`,
      }),
    });

    const session = await response.json();
    console.log(session);
    const result = stripe.redirectToCheckout({ sessionId: session.sessionId });
    if (result) {
      console.log(result);
    }
  };

  return (
    <div className="flex flex-col w-full h-full pb-20 border pt-7 bg-gray-50 lg:h-full lg:flex-row lg:justify-between animate-fadeIn">
      {/* Transaction Section */}
      <div className="w-full px-5 lg:px-8">
        <div className="flex justify-center mb-10">
          <button
            onClick={handleOpenModal}
            className="px-6 py-4 text-lg font-semibold text-white transition-transform transform rounded-lg shadow-lg bg-button-gpt hover:bg-button-gpt-dark hover:scale-105"
          >
            Utilize Credit for Discount
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h4" className="text-xl sm:text-2xl">
                Bills
              </Typography>
              <MuiButton variant="outlined" color="error" onClick={clearBills}>
                Remove All
              </MuiButton>
            </div>

            {/* Scrollable List of Bills */}
            <div className="w-full space-y-4 overflow-y-auto h-80 custom-scrollbar">
              {visibleItems.map((bill) => (
                <CartItem
                  key={bill.id}
                  productName={bill.name}
                  productPrice={bill.amount}
                  productStatus={bill.status}
                  dueDate={bill.dueDate}
                  onRemove={() => {
                    removeBill(bill.id);
                  }}
                  selected={false}
                  onClick={() =>
                    console.log(`Item with ID ${bill.id} clicked.`)
                  }
                />
              ))}
            </div>
          </div>

          <div className="w-full mt-8 lg:mt-0">
            <OrderSummary
              visibleItems={visibleItems}
              subtotal={subtotal}
              discount={discount}
              total={total}
              creditApplied={creditApplied}
              unifiedDueDate={savingsForBill.unifiedDueDate}
              percentageApplied={savingsForBill.percentageApplied}
              makePayment={makePayment}
            />
          </div>
        </div>
      </div>

      {/* Credit Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        className="flex items-center justify-center ml-48"
      >
        <Fade in={isModalOpen}>
          <div className="p-6 bg-white rounded-lg shadow-xl w-96">
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
              Utilize Credit
            </h2>
            <p className="mb-4 text-lg text-center text-gray-600">
              Available Credits:{" "}
              <span className="font-semibold">
                <CurrencyFormat
                  value={`${
                    availableCredits?.toString().includes(".")
                      ? availableCredits.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })
                      : `${availableCredits}.00`
                  }`}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </span>
            </p>
            <CurrencyFormat
              customInput={TextField}
              onChange={(e) => {
                const number = parseInt(
                  e.target.value.replace(/[$,]/g, ""),
                  10
                );
                setCreditInput(number);
              }}
              label="Enter Credit Amount"
              fullWidth
              variant="outlined"
              // placeholder="Enter credit amount"
              // className="w-full  text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-gpt focus:border-button-gpt transition duration-300 hover:shadow-lg"
              type="tel"
              prefix="$"
              thousandSeparator={true}
            />
            {/* <TextField
              type="number"
              label="Enter Credit Amount"
              // value={creditInput}
              onChange={handleCreditChange}
              fullWidth
              variant="outlined"
            /> */}
            <div className="flex justify-end mt-6">
              <MuiButton
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ color: "#10a37f", borderColor: "#10a37f" }}
              >
                Cancel
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleApplyCredits}
                sx={{ marginLeft: "10px", backgroundColor: "#10a37f" }}
              >
                Apply Credits
              </MuiButton>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Transaction;
// CartItem Component
const CartItem: React.FC<any> = ({
  productName,
  productPrice,
  productStatus,
  dueDate,
  onRemove,
  selected,
  onClick,
}) => {
  const errors = [];
  const date = dueDate ? DateTime.fromISO(dueDate) : null;
  const today = DateTime.now();
  if (date && today > date) {
    errors.push("The payment is past the due date.");
  }
  // console.log(errors);

  return (
    <div
      className={`w-full rounded-lg shadow-xl overflow-hidden bg-gray-50 text-lg ${
        selected ? "border-4 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex p-4">
        <div className="w-full pl-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            {productName}
          </h3>
          <p className="mt-2 text-gray-600">{productStatus}</p>
          <div className="flex justify-between mt-6">
            <span className="text-2xl font-bold text-button-gpt">
              <CurrencyFormat
                value={`${
                  productPrice.toString().includes(".")
                    ? productPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : `{${productPrice}}.00`
                }`}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            </span>
            <button
              onClick={onRemove}
              className="px-3 py-1 mr-3 text-white rounded-md bg-button-gpt hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          {errors.length > 0 && (
            <div className="mt-4 text-red-600">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderSummary: React.FC<any> = ({
  visibleItems,
  subtotal,
  discount,
  total,
  creditApplied,
  unifiedDueDate,
  percentageApplied,
  makePayment,
}) => {
  console.log(discount);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(visibleItems);
  // Convert unifiedDueDate to a DateTime object for comparison

  // Determine error messages
  const errors: string[] = [];
  if (visibleItems.length >= 2 && total < 100) {
    errors.push(
      "Total must be at least $100 when there are two or more items."
    );
  }

  return (
    <div className="flex flex-col justify-between w-full ml-5 bg-white rounded-lg shadow-md px-9 py-9 h-fit">
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Order Summary
        </h2>
        <div className="flex items-center justify-between py-2 border-b border-gray-300">
          <span className="text-lg text-gray-700">Subtotal</span>
          <span className="text-lg text-gray-800">
            <CurrencyFormat
              value={`${
                subtotal.toString().includes(".")
                  ? subtotal.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : `{${subtotal}}.00`
              }`}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </span>
        </div>
        {unifiedDueDate && (
          <div className="flex items-center justify-between py-2 border-b border-gray-300">
            <span className="text-lg text-gray-700">Due Date</span>
            <span className="text-lg text-gray-800">{unifiedDueDate}</span>
          </div>
        )}
        {percentageApplied !== 0 && (
          <>
            <div className="flex items-center justify-between py-2 border-b border-gray-300">
              <span className="text-lg text-gray-700">Savings Applied</span>
              <span className="text-lg text-gray-800">
                {percentageApplied}%
              </span>
            </div>
            <span className="text-lg text-green-500">
              Savings achieved will be added to your credit
            </span>
          </>
        )}

        {/* <div className="flex items-center justify-between py-2 border-b border-gray-300">
          <span className="text-lg text-gray-700">Savings Achieved</span>
          <span className="text-lg text-green-500">
            <CurrencyFormat
              value={`-${
                discount.toString().includes(".")
                  ? discount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : `{${discount}}.00`
              }`}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </span>
        </div> */}
        {creditApplied > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-300">
            <span className="text-lg text-gray-700">Credit </span>
            <span className="text-lg text-green-500">
              <CurrencyFormat
                value={`-${
                  creditApplied.toString().includes(".")
                    ? creditApplied.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                    : `{${creditApplied}}.00`
                }`}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            </span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 text-lg font-semibold">
          <span className="text-gray-800">Total</span>
          <span className="text-xl text-blue-600">
            <CurrencyFormat
              value={`${
                total.toString().includes(".")
                  ? total.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : `{${total}}.00`
              }`}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
          </span>
        </div>
      </div>
      <Button
        isLoading={isLoading}
        disabled={errors.length > 0 ? true : false}
        onPress={() => {
          setIsLoading(true);
          makePayment().then(() => {
            setIsLoading(false);
          });
        }}
        className="px-10 py-3 text-lg font-semibold text-white transition-transform transform rounded-lg shadow-md mt-6 bg-button-gpt hover:bg-button-gpt-dark hover:scale-105"

        // className="bg-button-gpt hover:bg-button-gpt-hover"
      >
        {isLoading ? "Checking Out..." : "Pay Now"}
      </Button>
      {/* <button
        className="px-10 py-3 text-lg font-semibold text-white transition-transform transform rounded-lg shadow-md mt-6 bg-button-gpt hover:bg-button-gpt-dark hover:scale-105"
        disabled={errors.length > 0 ? true : false}
        onClick={makePayment}
      >
        Pay Now
      </button> */}
      {errors.length > 0 && (
        <div className="mt-4 text-red-600">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

interface Bill {
  accountNumber: string;
  amount: string; // Amount is now a string, so we need to convert it to number
  created_at: string; // Timestamp, not needed for calculations
  dueDate: string; // Due date in string format
  name: string;
  updated_at: string; // Timestamp, not needed for calculations
  user_id: string;
}

const calculateSavingsForBills = (
  user: any, // User information, including timezone
  bills: Bill[] // Array of bill objects
): {
  totalSavings: number;
  unifiedDueDate: string | null;
  percentageApplied: number;
} => {
  // Helper function to determine savings percentage based on days paid early
  const calculateSavingsPercentage = (
    dueDate: DateTime,
    paymentDate: DateTime
  ): number => {
    const daysEarly = Math.floor(dueDate.diff(paymentDate, "days").days);

    if (daysEarly >= 15) return 15;
    if (daysEarly >= 8) return 10;
    if (daysEarly >= 4) return 5;
    if (daysEarly >= 1) return 2;
    return 0;
  };

  if (bills.length === 0) {
    return { totalSavings: 0, unifiedDueDate: null, percentageApplied: 0 };
  }

  const today = DateTime.now().setZone(user.timeZone);
  let totalSavings = 0;
  let percentageApplied = 0;

  // When there is one bill
  if (bills.length === 1) {
    const bill = bills[0];
    const dueDate = DateTime.fromISO(bill.dueDate, { zone: user.timeZone });

    if (!dueDate.isValid) {
      console.error("Invalid due date:", bill);
      return { totalSavings: 0, unifiedDueDate: null, percentageApplied: 0 };
    }

    const amount = parseFloat(bill.amount);
    percentageApplied = calculateSavingsPercentage(dueDate, today);
    totalSavings = (amount * percentageApplied) / 100;

    return {
      totalSavings,
      unifiedDueDate: dueDate.toISODate(),
      percentageApplied,
    };
  }

  // When there are multiple bills
  const totalAmount = bills.reduce(
    (totalAmount, bill) => totalAmount + parseFloat(bill.amount),
    0
  );

  totalSavings = totalAmount * 0.15;
  percentageApplied = 15;

  // Calculate unified due date as the latest due date among the bills
  const unifiedDueDate = bills
    .map((bill) => DateTime.fromISO(bill.dueDate, { zone: user.timeZone }))
    .filter((dueDate) => dueDate.isValid)
    .sort((a, b) => a.valueOf() - b.valueOf())[0] // Get the earliest valid due date
    ?.toISODate();

  return { totalSavings, unifiedDueDate, percentageApplied };
};
