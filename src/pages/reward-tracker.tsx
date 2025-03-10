import ChartR from "../components/chartR";
import TableCredits from "@/components/TableOneForCredits";
import { useAuth } from "@/context/AuthContext";
import CenteredBoxWithButtons from "@/components/addOrSendCreditCard";
import { useUserAssets } from "@/context/userSpecificAssetsContext";

const RewardTracker = () => {
  const { userCredits } = useUserAssets();
  const { user } = useAuth();

  return (
    <div className="w-full overflow-hidden md:pb-50">
      <div className="flex flex-col items-center justify-center px-4 py-16 bg-button-gpt-hover">
        <h2 className="mb-6 text-3xl font-semibold text-white sm:text-4xl">
          Credits Tracker
        </h2>
        <ChartR user={user} />
      </div>

      {userCredits?.length ? (
        <div className="mt-16 bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 md:text-4xl">
              Credits Transaction History:
            </h3>
          </div>
          <div className="flex items-center justify-center mt-12 mb-10">
            <div className="w-full max-w-4xl p-4 border border-gray-200 rounded-lg shadow-lg">
              <TableCredits creditDocs={userCredits} />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex flex-col items-center justify-center px-4 py-16 bg-button-gpt-hover">
        <h2 className="mb-6 text-3xl font-semibold text-white sm:text-4xl">
          Credits Transaction
        </h2>
        <CenteredBoxWithButtons />
      </div>

      {/* Hero Section */}
    </div>
  );
};

export default RewardTracker;
