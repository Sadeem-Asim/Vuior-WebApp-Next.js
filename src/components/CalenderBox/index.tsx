import { useState } from "react";
import { useUserAssets } from "@/context/userSpecificAssetsContext";
import CurrencyFormat from "react-currency-format";
import { useNavigate } from "react-router-dom";

const CalendarBox = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const navigate = useNavigate();
  const { userBills } = useUserAssets();
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const currentYear = currentDate.getFullYear();
  const upcomingBills = getUpcomingBillsByMonth(userBills);

  const navigateYear = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const firstDayOfWeek = startOfMonth.getDay();
  const totalDaysInMonth = getDaysInMonth(currentDate);
  const calculateSavingsPercentage = (daysEarly: number): number => {
    if (daysEarly >= 15) return 15;
    if (daysEarly >= 8) return 10;
    if (daysEarly >= 4) return 5;
    if (daysEarly >= 1) return 2;
    return 0;
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-wrap justify-between items-center p-4 text-white bg-button-gpt-hover rounded-t-[10px]">
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-button-gpt hover:bg-opacity-90"
                onClick={() => navigateYear(-1)}
              >
                « Year
              </button>
              <button
                className="px-3 py-1 rounded bg-button-gpt hover:bg-opacity-90"
                onClick={() => navigateMonth(-1)}
              >
                « Month
              </button>
            </div>
            <span className="text-lg font-medium whitespace-nowrap">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded bg-button-gpt hover:bg-opacity-90"
                onClick={() => navigateMonth(1)}
              >
                Month »
              </button>
              <button
                className="px-3 py-1 rounded bg-button-gpt hover:bg-opacity-90"
                onClick={() => navigateYear(1)}
              >
                Year »
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="grid grid-cols-7 text-white bg-primary">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => (
                  <th
                    key={index}
                    className="flex items-center justify-center p-1 font-medium bg-button-gpt h-15 text-body-xs sm:text-base xl:p-5"
                  >
                    <span className="hidden lg:block">{day}</span>
                    <span className="block lg:hidden">{day.slice(0, 3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ...Array(Math.ceil((totalDaysInMonth + firstDayOfWeek) / 7)),
              ].map((_, rowIndex) => (
                <tr key={rowIndex} className="grid grid-cols-7">
                  {[...Array(7)].map((_, colIndex) => {
                    const day = rowIndex * 7 + colIndex - firstDayOfWeek + 1;
                    if (day > 0 && day <= totalDaysInMonth) {
                      const markedBill =
                        upcomingBills[currentYear] &&
                        upcomingBills[currentYear][currentMonth]
                          ? upcomingBills[currentYear][currentMonth].find(
                              (bill) => bill.day === day
                            )
                          : null;

                      const isMarked = !!markedBill;
                      const isUnpaid = markedBill?.status === "unpaid";
                      const isPending = markedBill?.status === "pending";
                      const today = new Date();
                      const currentDate = today.getDate();
                      const currentMonthIndex = today.getMonth();
                      // const currentYear = today.getFullYear();
                      console.log(currentMonth);
                      // Determine if the `day` belongs to the next month
                      const isNextMonth =
                        currentMonthIndex !== Number(currentMonth);

                      // If the bill is in the next month, calculate days remaining correctly
                      let daysLeft;
                      if (isNextMonth) {
                        const lastDayOfCurrentMonth = new Date(
                          currentYear,
                          currentMonthIndex + 1,
                          0
                        ).getDate();
                        daysLeft = lastDayOfCurrentMonth - currentDate + day;
                      } else {
                        daysLeft = day - currentDate;
                      }

                      // Ensure `daysLeft` is always a positive number
                      daysLeft = Math.max(daysLeft, 0);

                      const savings = calculateSavingsPercentage(daysLeft);

                      // const daysLeft = day - new Date().getDate();
                      // const savings = calculateSavingsPercentage(daysLeft);

                      return (
                        <td
                          key={colIndex}
                          className={`relative h-24 p-1 transition duration-500 border cursor-pointer ease border-stroke hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 md:h-25 md:p-6 xl:h-31 ${
                            isMarked
                              ? (isUnpaid
                                  ? "bg-button-red"
                                  : isPending
                                  ? "bg-button-yellow"
                                  : "bg-button-gpt") + " text-white"
                              : "bg-transparent"
                          }`}
                          onMouseEnter={() => isUnpaid && setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {isMarked ? (
                            <div
                              className="absolute left-2 top-3 z-99 flex w-[300%] flex-col rounded-r-[5px] border-l-[3px] border-white px-3 py-1 text-left dark:bg-dark-2 md:w-[290%] md:mb-10 md:group-hover:visible md:group-hover:opacity-100 cursor-pointer"
                              onClick={() => navigate("/bills")}
                            >
                              {hoveredDay === day ? (
                                <>
                                  <span className="event-name font-sm text-dark dark:text-white">
                                    {`Days Left: ${
                                      daysLeft > 0 ? daysLeft : "Due Today"
                                    }`}
                                  </span>
                                  <span>
                                    {`Savings : ${savings > 0 ? savings : "0"}`}
                                    %
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="event-name font-sm text-dark dark:text-white">
                                    {`Bill: ${truncateString(
                                      markedBill?.name,
                                      15
                                    )}`}
                                  </span>
                                  <span className="event-name font-sm text-dark dark:text-white">
                                    {`Amount: `}
                                    <CurrencyFormat
                                      value={`${
                                        markedBill?.amount
                                          .toString()
                                          .includes(".")
                                          ? markedBill.amount.toLocaleString(
                                              undefined,
                                              {
                                                maximumFractionDigits: 2,
                                              }
                                            )
                                          : `${markedBill.amount}.00`
                                      }`}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                      prefix={"$"}
                                    />
                                  </span>
                                  <span className="event-name font-sm text-dark dark:text-white">{`Day: ${day}`}</span>
                                </>
                              )}
                            </div>
                          ) : (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CalendarBox;

function truncateString(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

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
  Record<
    string,
    { name: string; amount: number; day: number; status: string }[]
  >
> {
  const currentDate = new Date();

  // Get today's date
  const todayDay = currentDate.getDate();
  const todayMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const todayYear = currentDate.getFullYear();

  // Filter bills that have a due date greater than or equal to the current date
  const upcomingBills = bills;
  // .filter((bill) => {
  //   const billDueDate = new Date(bill.dueDate);
  //   return billDueDate >= currentDate && bill.status !== "paid";
  // });

  // Group the filtered bills by year and month
  const groupedBills: Record<
    string,
    Record<
      string,
      { name: string; amount: number; day: number; status: string }[]
    >
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
      status: bill.status,
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
          status: bill.status,
        });
      }
    }
  });

  return groupedBills;
}
// function truncateString(str: any, maxLength: any) {
//   return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
// }
