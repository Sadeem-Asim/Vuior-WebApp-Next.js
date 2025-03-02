import CalendarBox from "@/components/CalenderBox";

const CalendarPage = () => {
  return (
    <div className="mx-auto max-w-7xl mt-9">
      {/* Legend Section */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 rounded-full"></span>
          <span>Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded-full"></span>
          <span>Unpaid</span>
        </div>
      </div>

      {/* Calendar Component */}
      <CalendarBox />
    </div>
  );
};

export default CalendarPage;
// console.log(upcomingBills);
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
