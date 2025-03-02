/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa"; // Import bell icon from react-icons
import Avatar from "../avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebaseConfig"; // Firebase configuration
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

const DashboardHeader: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user }: any = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", user.id),
      orderBy("timestamp", "desc")
    );

    // Real-time listener for new notifications
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Extract new notifications only
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(newNotifications);

        if (newNotifications.length > 0) {
          setNotifications((prev) => [...newNotifications, ...prev]); // Add new notifications at the top
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user]);

  // Function to clear all notifications
  const clearAllNotifications = async () => {
    if (!user?.id) return;

    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("userId", "==", user.id));

      const snapshot = await getDocs(q);

      // Delete each notification
      snapshot.forEach(async (notif: any) => {
        await deleteDoc(doc(db, "notifications", notif.id));
      });

      setNotifications([]); // Clear state after deletion
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="flex flex-row justify-around ">
      <div
        onClick={() => setShowNotifications(!showNotifications)}
        className="flex items-center justify-between px-4 ml-3 mr-2 text-white bg-red-600 rounded-full cursor-pointer"
      >
        <div className="relative">
          <FaBell size={20} className="cursor-pointer" />

          {/* Show notification box when clicked */}
          {showNotifications && (
            <div
              className="absolute z-50 p-4 mt-2 text-black transition duration-300 bg-white rounded-lg shadow-lg w-72 right-7 animate-fadeIn"
              style={{ animation: "fadeIn 0.3s" }}
            >
              <h3 className="mb-3 text-lg font-semibold flex justify-between">
                Notifications
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-red-500 text-xs font-bold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </h3>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new notifications</p>
              ) : (
                <ul className="space-y-2">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <li key={index}>
                      <div className="flex items-center p-2 space-x-3 bg-gray-200 rounded-md shadow-lg">
                        {/* <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-button-gpt">
                          {index + 1}
                        </span> */}
                        <span className="text-sm">{notification.message}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Avatar */}
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
        <Avatar imageUrl={user?.avatar || ""} />
      </div>
    </div>
  );
};

export default DashboardHeader;
