/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import TotalIncomeDarkCard from "../../src/components/cards/TotalIncomeDarkCard";
import TotalIncomeLightCard from "../../src/components/cards/TotalIncomeLightCard";
import WeeklyChart from "../../src/components/charts/weekly";
import ExpenseChart from "../../src/components/charts/expenseChart";
import EarningCard from "@/components/cards/earningCard/code";
import TotalOrderLineChartCard from "@/components/cards/totalOrderLineChartCard/code";
import { Button } from "@nextui-org/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserAssets } from "@/context/userSpecificAssetsContext";
import { db } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
const updateStripeCustomer = async (user: any) => {
  const userRef = doc(db, "users", user.id);
  let stripeCustomerId = user?.stripeCustomerId;

  const response = await fetch(
    "https://createstripecustomer-5risxnudva-uc.a.run.app",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    }
  );

  const session = await response.json();
  stripeCustomerId = session.stripeCustomerId;
  await updateDoc(userRef, { stripeCustomerId });
};
const DashboardHome = () => {
  console.log(React);
  const { user } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly"); // To track selected period (monthly/yearly)
  const { stats } = useUserAssets();

  useEffect(() => {
    // Preload any assets or data
    import("@/pages/creditTransaction");

    if (!user?.stripeCustomerId) {
      updateStripeCustomer(user);
    }
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleButtonClick = (period: any) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="container p-4 mx-auto">
      {/* Cards Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <EarningCard isLoading={isLoading} stats={stats} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalOrderLineChartCard isLoading={isLoading} stats={stats} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalIncomeDarkCard isLoading={isLoading} stats={stats} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalIncomeLightCard
            isLoading={isLoading}
            user={user}
            buttons={true}
          />
        </Grid>
      </Grid>

      <div className="mt-12">
        {/* Charts Section */}
        <Grid container spacing={4} mt-8>
          <Grid item xs={12} sm={12} md={8}>
            <div className="p-6 bg-white rounded-lg shadow-2xl">
              <h2 className="mb-4 text-lg font-medium text-gray-800">
                Annually Overview
              </h2>
              <WeeklyChart stats={stats} />
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="flex flex-row justify-between ">
                <h2 className="mb-4 text-lg font-medium text-gray-800">
                  Bills Breakdown
                </h2>
                <div className="">
                  <Button
                    className="w-1"
                    size="sm"
                    style={{
                      width: "1px",
                      backgroundColor:
                        selectedPeriod === "monthly" ? "#0287c3" : "",
                      color: selectedPeriod === "monthly" ? "white" : "black",
                    }}
                    variant={selectedPeriod === "monthly" ? "solid" : "light"}
                    onClick={() => handleButtonClick("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    style={{
                      width: "1px",
                      backgroundColor:
                        selectedPeriod === "yearly" ? "#0287c3" : "",
                      color: selectedPeriod === "yearly" ? "white" : "black",
                    }}
                    size="sm"
                    variant={selectedPeriod === "yearly" ? "solid" : "light"}
                    onClick={() => handleButtonClick("yearly")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>
              <div className="h-96">
                <ExpenseChart stats={stats} period="month" />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default DashboardHome;
