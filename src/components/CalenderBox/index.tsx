/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUserAssets } from "@/context/userSpecificAssetsContext";
import CurrencyFormat from "react-currency-format";
// import { useEffect } from "react";

const CalendarBox = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  });
  const { userBills } = useUserAssets();
  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  const currentYear = currentDate.getFullYear();
  const upcomingBills = getUpcomingBillsByMonth(userBills);
  // useEffect(() => {
  //   if (!upcomingBills[currentYear][currentMonth]) {
  //     // Find the first month in upcomingBills[currentYear] and navigate to it
  //     let upcomingMonths = Object.keys(upcomingBills[currentYear] || null);
  //     upcomingMonths = upcomingMonths.reverse();
  //     if (upcomingMonths.length > 0 || !upcomingMonths) {
  //       const firstAvailableMonth = upcomingMonths[0];
  //       const targetMonthIndex = new Date(
  //         `${firstAvailableMonth} 1, ${currentYear}`
  //       ).getMonth();
  //       const currentMonthIndex = currentDate.getMonth();
  //       const monthDifference = targetMonthIndex - currentMonthIndex;
  //       if (monthDifference !== 0) {
  //         navigateMonth(monthDifference);
  //       }
  //     }
  //   }
  // }, []);
  const navigateYear = (direction: any) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };
  // Function to handle month navigation
  const navigateMonth = (direction: any) => {
    const newDate = new Date(currentDate);
    const getMonth = currentDate.getMonth() || 0;
    newDate.setMonth(getMonth + direction);
    setCurrentDate(newDate);
  };
  // Function to handle year navigation
  const getDaysInMonth = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate(); // Get number of days in the month
  };
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ); // First day of the month
  const firstDayOfWeek = startOfMonth.getDay(); // Day of the week the month starts on
  const totalDaysInMonth = getDaysInMonth(currentDate);
  return (
    <>
      <div className="w-full max-w-full  bg-white shadow-1 dark:bg-gray-dark dark:shadow-card ">
        <div className="flex rounded-t-[10px] justify-between items-center p-4  text-white  bg-button-gpt-hover">
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-button-gpt rounded hover:bg-opacity-90"
              onClick={() => navigateYear(-1)}
            >
              « Year
            </button>
            <button
              className="px-3 py-1 bg-button-gpt rounded hover:bg-opacity-90"
              onClick={() => navigateMonth(-1)}
            >
              « Month
            </button>
          </div>
          <span className="text-lg font-medium">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-button-gpt rounded hover:bg-opacity-90"
              onClick={() => navigateMonth(1)}
            >
              Month »
            </button>
            <button
              className="px-3 py-1 bg-button-gpt rounded hover:bg-opacity-90"
              onClick={() => navigateYear(1)}
            >
              Year »
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7  bg-primary text-white">
              <th className="bg-button-gpt flex h-15 items-center justify-center  p-1 text-body-xs font-medium sm:text-base xl:p-5">
                <span className="hidden lg:block"> Sunday </span>
                <span className="block lg:hidden"> Sun </span>
              </th>
              <th className="flex items-center justify-center p-1 font-medium h-15 text-body-xs sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Monday </span>
                <span className="block lg:hidden"> Mon </span>
              </th>
              <th className="flex items-center justify-center p-1 font-medium h-15 text-body-xs sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Tuesday </span>
                <span className="block lg:hidden"> Tue </span>
              </th>
              <th className="flex items-center justify-center p-1 font-medium h-15 text-body-xs sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Wednesday </span>
                <span className="block lg:hidden"> Wed </span>
              </th>
              <th className="flex items-center justify-center p-1 font-medium h-15 text-body-xs sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Thursday </span>
                <span className="block lg:hidden"> Thur </span>
              </th>
              <th className="flex items-center justify-center p-1 font-medium h-15 text-body-xs sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Friday </span>
                <span className="block lg:hidden"> Fri </span>
              </th>
              <th className="flex h-15 items-center justify-center rounded-tr-[10px] p-1 text-body-xs font-medium sm:text-base xl:p-5 bg-button-gpt">
                <span className="hidden lg:block"> Saturday </span>
                <span className="block lg:hidden"> Sat </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.ceil((totalDaysInMonth + firstDayOfWeek) / 7))].map(
              (_, rowIndex) => (
                <tr key={rowIndex} className="grid grid-cols-7">
                  {[...Array(7)].map((_, colIndex) => {
                    const day = rowIndex * 7 + colIndex - firstDayOfWeek + 1;
                    if (day > 0 && day <= totalDaysInMonth) {
                      const markedBill =
                        upcomingBills[currentYear] &&
                        upcomingBills[currentYear][currentMonth.toLowerCase()]
                          ? upcomingBills[currentYear][
                              currentMonth.toLowerCase()
                            ].find((bill) => bill.day === day)
                          : null;

                      const isMarked = !!markedBill; // Converts the result to a boolean
                      const markedBillName = markedBill
                        ? markedBill.name
                        : null;
                      const markedBillAmount = markedBill
                        ? markedBill.amount
                        : null;

                      return (
                        <td
                          key={colIndex}
                          className={`relative h-24 p-1 transition duration-500 border cursor-pointer ease border-stroke hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 md:h-25 md:p-6 xl:h-31 ${
                            isMarked
                              ? "bg-button-gpt text-white"
                              : "bg-transparent"
                          }`}
                        >
                          {isMarked ? (
                            <div
                              className="
                               event invisible 
                            absolute left-2 top-3
                            z-99
                            
                            flex
                            w-[300%]
                             flex-col
                             rounded-r-[5px]
                              border-l-[3px]
                               border-white
                               
                               px-3 py-1
                               
                                text-left
                                 opacity-0
                                 group-hover:visible
                                  group-hover:opacity-100
                                  dark:bg-dark-2
                                  md:visible
                                  md:w-[290%]
                                  md:mb-10
                                  md:opacity-100"
                            >
                              <span className="event-name font-sm text-dark dark:text-white">
                                {`Bill:${truncateString(markedBillName, 15)}`}
                              </span>
                              <span className="event-name font-sm text-dark dark:text-white">
                                {`Amount:`}
                                <CurrencyFormat
                                  value={`${
                                    markedBillAmount?.toString().includes(".")
                                      ? markedBillAmount.toLocaleString(
                                          undefined,
                                          {
                                            maximumFractionDigits: 2,
                                          }
                                        )
                                      : `{${markedBillAmount}}.00`
                                  }`}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"$"}
                                />
                              </span>
                              <span className="event-name font-sm text-dark dark:text-white">
                                {`Day:${day}`}
                              </span>
                            </div>
                          ) : (
                            // </div>
                            <span className="font-medium text-dark dark:text-white">
                              {day}
                            </span>
                          )}
                        </td>
                      );
                    }
                    return <td key={colIndex}></td>;
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CalendarBox;

interface Bill {
  name: string;
  dueDate: string;
  amount: number;
  status: string;
}

function getUpcomingBillsByMonth(
  bills: Bill[]
): Record<
  string,
  Record<string, { name: string; amount: number; day: number }[]>
> {
  const currentDate = new Date();

  // Get today's date
  const todayDay = currentDate.getDate();
  const todayMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const todayYear = currentDate.getFullYear();

  // Filter bills that have a due date greater than or equal to the current date
  const upcomingBills = bills.filter((bill) => {
    const billDueDate = new Date(bill.dueDate);
    return billDueDate >= currentDate && bill.status !== "paid";
  });

  // Group the filtered bills by year and month
  const groupedBills: Record<
    string,
    Record<string, { name: string; amount: number; day: number }[]>
  > = {};

  upcomingBills.forEach((bill) => {
    const billDueDate = new Date(bill.dueDate);
    const billYear = billDueDate.getFullYear();
    const month = billDueDate
      .toLocaleString("default", { month: "long" })
      .toLowerCase(); // Get the month in lowercase
    const day = billDueDate.getDate(); // Get the day of the month

    // Initialize year and month groups
    if (!groupedBills[billYear]) {
      groupedBills[billYear] = {};
    }
    if (!groupedBills[billYear][month]) {
      groupedBills[billYear][month] = [];
    }

    // Add the bill to the respective year and month group
    groupedBills[billYear][month].push({
      name: bill.name,
      amount: bill.amount,
      day: day,
    });
  });

  // Check if today's bills are present and add them if needed
  bills.forEach((bill) => {
    const billDueDate = new Date(bill.dueDate);
    if (
      billDueDate.getFullYear() === todayYear &&
      billDueDate.getMonth() === currentDate.getMonth() &&
      billDueDate.getDate() === todayDay
    ) {
      if (!groupedBills[todayYear]) {
        groupedBills[todayYear] = {};
      }
      if (!groupedBills[todayYear][todayMonth]) {
        groupedBills[todayYear][todayMonth] = [];
      }

      // Add today's bill if not already added
      if (
        !groupedBills[todayYear][todayMonth].some(
          (item) => item.day === todayDay && item.name === bill.name
        )
      ) {
        groupedBills[todayYear][todayMonth].push({
          name: bill.name,
          amount: bill.amount,
          day: todayDay,
        });
      }
    }
  });

  return groupedBills;
}
function truncateString(str: any, maxLength: any) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
