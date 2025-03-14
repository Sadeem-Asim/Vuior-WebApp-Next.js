import TableOne from "../components/TableOneForRewards";
import { useUserAssets } from "@/context/userSpecificAssetsContext";

const PaymentsHistory = () => {
  const { userPreviousTransactions, userBills } = useUserAssets();
  return (
    <div className="w-full overflow-hidden mt-6 bg-white">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-800 md:text-4xl">
          Payments History
        </h3>
      </div>
      <div className="flex items-center justify-center mt-8">
        <div className="w-full max-w-4xl p-4 border border-gray-200 rounded-lg shadow-lg">
          <TableOne
            paymentData={userPreviousTransactions}
            userBills={userBills}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsHistory;
