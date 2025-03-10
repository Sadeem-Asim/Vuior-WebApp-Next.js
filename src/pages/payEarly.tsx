import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import BillCard from "@/components/cards/billCard";
import { Grid, Box } from "@mui/material";
import Button from "@/components/button";
import { ClipLoader } from "react-spinners";
import { useBillPaymentContext } from "../context/paymentBillsContext";
import { useUserAssets } from "@/context/userSpecificAssetsContext";
import { Timestamp } from "firebase/firestore";

// Define the Bill type
interface Bill {
  id: string;
  user_id: string;
  name: string;
  biller_id?: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method_id: string;
  early_payment_savings?: number;
  is_consolidated?: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  autoPay?: boolean;
}

const PayEarly = () => {
  const { user } = useAuth();
  const { userBills } = useUserAssets();
  const { addAllBillsOnce } = useBillPaymentContext();
  const [selectedBills, setSelectedBills] = useState<Bill[]>([]);
  const [loading] = useState<boolean>(false);
  const navigate = useNavigate();

  const unPaidBills = useMemo(() => {
    return userBills.filter(
      (bill: { autoPay: boolean; status: string }) =>
        bill.status !== "paid" && bill.autoPay === false
    );
  }, [userBills]);
  // Update context whenever selectedBills changes
  useEffect(() => {
    addAllBillsOnce(selectedBills);
  }, [selectedBills, addAllBillsOnce]);

  // Handle selecting or deselecting a bill
  const handleCardClick = (bill: Bill) => {
    setSelectedBills(
      (prev) =>
        prev.some((selectedBill) => selectedBill.id === bill.id)
          ? prev.filter((selectedBill) => selectedBill.id !== bill.id) // Deselect
          : [...prev, bill] // Select
    );
  };

  return (
    <div className="px-4">
      {/* Header Section */}
      <div className="flex flex-row justify-between w-full">
        <div>
          <h2 className="text-2xl font-bold">Hey, {user?.firstName}!</h2>
          <p className="mt-2 text-gray-500">
            Total Bills: {unPaidBills?.length}
          </p>
        </div>
        <div>
          <Button
            children="Proceed"
            className="text-lg w-15 bg-button-gpt rounded-xl h-2/3"
            onClick={() => navigate("/transaction")}
          />
        </div>
      </div>

      {/* Grid Section */}
      <Box sx={{ flexGrow: 1, paddingTop: "2em" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <ClipLoader size={70} color="#39b996" />
          </div>
        ) : (
          <Grid container justifyContent="center" spacing={2}>
            {unPaidBills.map((bill: Bill) => (
              <Grid item key={bill.id}>
                <div
                  className={`rounded-xl cursor-pointer p-3 ${
                    selectedBills.some((b) => b.id === bill.id)
                      ? "animate-glow transform scale-93 shadow-xl shadow-button-gpt transition-all"
                      : "transition-shadow transform"
                  }`}
                  onClick={() => handleCardClick(bill)}
                >
                  <BillCard bill={bill} />
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default PayEarly;
