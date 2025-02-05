/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import { FaBell } from "react-icons/fa"; // Import bell icon from react-icons
import Avatar from "../avatar";
import { useAuth } from "@/hooks/useAuth";
// import { db } from "../../lib/firebaseConfig"; // import the Firebase configuration
// import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { useNavigate } from "react-router-dom";
const DashboardHeader: React.FC = () => {
  // const [notifications, setNotifications] = useState<string[]>([]);
  // const [showNotifications, setShowNotifications] = useState<boolean>(false);
  // const [fuser, setFUser] = useState<any>(null);
  const navigate = useNavigate();
  const { user }: any = useAuth();
  // console.log("AUTH:", user);

  // const sampleNotifications = [
  //   "Payment for Order #1234 received. Reward: 10% off",
  //   "New reward available! Earn a discount for early payments.",
  //   "Reminder: Make a payment before the due date to earn rewards.",
  // ];

  // const handleBellClick = () => {
  //   // Show the notifications box
  //   setShowNotifications(!showNotifications);

  //   // Simulate receiving notifications (can be replaced with API calls)
  //   setNotifications(sampleNotifications);

  //   // Hide the notifications after 10 seconds
  //   setTimeout(() => {
  //     setShowNotifications(false);
  //     setNotifications([]); // Clear notifications after they disappear
  //   }, 5000); // 10 seconds
  // };

  return (
    <div className="flex flex-row justify-around ">
      {/* <div
        onClick={handleBellClick}
        className="flex items-center justify-between px-4 ml-3 mr-2 text-white bg-red-600 rounded-full cursor-pointer"
      >
        <div className="relative">
          <FaBell size={20} className="cursor-pointer" />

          {showNotifications && (
            <div
              className="absolute z-50 p-4 mt-2 text-black transition duration-300 bg-white rounded-lg shadow-lg w-72 right-7 animate-fadeIn"
              style={{ animation: "fadeIn 0.3s" }}
            >
              <h3 className="mb-3 text-lg font-semibold">Notifications</h3>
              <ul className="space-y-2">
                {notifications.map((notification, index) => (
                  <li key={index}>
                    <div className="flex items-center p-2 space-x-3 bg-gray-200 rounded-md shadow-lg">
                      <span className="flex items-center justify-center w-12 h-6 text-xs font-bold text-white rounded-full bg-button-gpt">
                        {index + 1}
                      </span>
                      <span className="text-sm">{notification}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div> */}
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/profile");
        }}
      >
        <Avatar imageUrl={user?.avatar || ""} />
      </div>
    </div>
  );
};

export default DashboardHeader;
