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
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const getDaysLeft = (billDay: number): number => {
    const billMonth = currentDate.getMonth();

    if (billMonth === todayMonth) {
      return billDay - todayDay;
    }

    let daysLeft = 0;
    const daysInCurrentMonth = new Date(todayYear, todayMonth + 1, 0).getDate();
    daysLeft = daysInCurrentMonth - todayDay;

    for (let m = todayMonth + 1; m < billMonth; m++) {
      daysLeft += new Date(todayYear, m + 1, 0).getDate();
    }

    daysLeft += billDay;
    return Math.max(daysLeft, 0);
  };

  return (
    <>
      {/* Top Navigation */}
      <div className="flex justify-between items-center bg-button-gpt-hover text-white p-4 rounded-t-lg flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => navigateYear(-1)}
            className="bg-button-gpt px-3 py-1 rounded"
          >
            « Year
          </button>
          <button
            onClick={() => navigateMonth(-1)}
            className="bg-button-gpt px-3 py-1 rounded"
          >
            « Month
          </button>
        </div>
        <div className="text-lg font-medium mt-2 sm:mt-0">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentYear}
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => navigateMonth(1)}
            className="bg-button-gpt px-3 py-1 rounded"
          >
            Month »
          </button>
          <button
            onClick={() => navigateYear(1)}
            className="bg-button-gpt px-3 py-1 rounded"
          >
            Year »
          </button>
        </div>
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="grid grid-cols-7 bg-button-gpt text-white">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, idx) => (
                  <th key={idx} className="text-center p-2 font-medium">
                    {day}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.ceil((totalDaysInMonth + firstDayOfWeek) / 7),
            }).map((_, rowIndex) => (
              <tr key={rowIndex} className="grid grid-cols-7">
                {Array.from({ length: 7 }).map((_, colIndex) => {
                  const day = rowIndex * 7 + colIndex - firstDayOfWeek + 1;

                  if (day > 0 && day <= totalDaysInMonth) {
                    const markedBill = upcomingBills?.[currentYear]?.[
                      currentMonth
                    ]?.find((b) => b.day === day);
                    const isMarked = !!markedBill;
                    const isUnpaid = markedBill?.status === "unpaid";
                    const isPending = markedBill?.status === "pending";
                    const daysLeft = getDaysLeft(day);
                    const savings = calculateSavingsPercentage(daysLeft);

                    return (
                      <td
                        key={colIndex}
                        className={`relative border border-stroke h-24 p-2 md:p-4 text-sm text-center ${
                          isMarked
                            ? isUnpaid
                              ? "bg-button-red text-white"
                              : isPending
                              ? "bg-button-yellow text-white"
                              : "bg-button-gpt text-white"
                            : ""
                        }`}
                        onMouseEnter={() => isUnpaid && setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {hoveredDay === day && isMarked ? (
                          <div
                            className=" z-10 bg-black p-2 rounded shadow-lg text-left cursor-pointer"
                            onClick={() => {
                              navigate("/bills");
                            }}
                          >
                            <p>Days Left: {daysLeft}</p>
                            <p>Savings: {savings}%</p>
                          </div>
                        ) : isMarked ? (
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              navigate("/bills");
                            }}
                          >
                            <span className="font-medium">{day}</span>
                            <p>Bill: {markedBill.name}</p>
                            <p>
                              Amount:{" "}
                              <CurrencyFormat
                                value={markedBill.amount}
                                displayType={"text"}
                                thousandSeparator
                                prefix={"$"}
                              />
                            </p>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium">{day}</span>
                          </>
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

      {/* Mobile View: Card Grid */}
      <div className="block md:hidden mt-5 px-2">
        {upcomingBills?.[currentYear]?.[currentMonth]?.length ? (
          upcomingBills[currentYear][currentMonth].map((bill) => {
            const isMarked = !!bill;
            const isUnpaid = bill?.status === "unpaid";
            const isPending = bill?.status === "pending";
            const daysLeft = getDaysLeft(bill.day);
            const savings = calculateSavingsPercentage(daysLeft);

            return (
              <div
                key={bill.name}
                className={`mb-4 p-4 rounded-lg shadow-md ${
                  isMarked
                    ? isUnpaid
                      ? "bg-button-red text-white"
                      : isPending
                      ? "bg-button-yellow text-white"
                      : "bg-button-gpt text-white"
                    : ""
                }`}
              >
                <p className="text-lg font-semibold">{bill.name}</p>
                <p className="text-sm">
                  Amount:{" "}
                  <CurrencyFormat
                    value={bill.amount}
                    displayType={"text"}
                    thousandSeparator
                    prefix={"$"}
                  />
                </p>
                <p className="text-sm">Due Day: {bill.day}</p>
                <p className="text-sm">Days Left: {daysLeft}</p>
                <p className="text-sm">Savings: {savings}%</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600">
            No upcoming bills for this month.
          </p>
        )}
      </div>
    </>
  );
};

export default CalendarBox;

// function truncateString(str: string, maxLength: number) {
//   return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
// }

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
