import React, { createContext, useContext, useReducer, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  documentId,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook for user information
import { DateTime } from "luxon";
// Initial State
const initialState = {
  userBills: [],
  userDocuments: [],
  userCredits: [],
  userPreviousTransactions: [],
  stats: {},
};

// Reducer Function
const userAssetsReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_BILLS":
      return { ...state, userBills: action.payload };
    case "SET_ALL_BILLS":
      return { ...state, userBills: action.payload };
    case "SET_ALL_DOCUMENTS":
      return { ...state, userDocuments: action.payload };
    case "SET_USER_CREDITS":
      return { ...state, userCredits: action.payload };
    case "SET_USER_PREVIOUS_TRANSACTIONS":
      return { ...state, userPreviousTransactions: action.payload };
    case "SET_USER_STATS":
      return { ...state, stats: action.payload };
    case "RESET_USER_ASSETS":
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create Context
const UserAssetsContext = createContext();
const UserAssetsDispatchContext = createContext();

// Provider Component
export const UserAssetsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userAssetsReducer, initialState);
  const { user } = useAuth(); // Get the current authenticated user

  useEffect(() => {
    if (!user) {
      // Reset state if user logs out
      dispatch({ type: "RESET_USER_ASSETS" });
      return;
    }

    // Real-time listener for bills
    const billsQuery = query(
      collection(db, "bills"),
      where("user_id", "==", user.id),
      where("isDeleted", "==", false)
    );
    const unsubscribeBills = onSnapshot(billsQuery, (querySnapshot) => {
      const bills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = DateTime.now().setZone(user.timeZone);

      // bills.forEach((bill) => {
      //   const dueDate = DateTime.fromISO(bill.dueDate, { zone: user.timeZone });
      //   const daysEarly = Math.floor(dueDate.diff(today, "days").days);
      // });
      dispatch({ type: "SET_ALL_BILLS", payload: bills });
    });

    // Real-time listener for documents
    const documentsQuery = query(
      collection(db, "documents"),
      where("userId", "==", user.id),
      where("isDeleted", "==", false)
    );
    const unsubscribeDocuments = onSnapshot(documentsQuery, (querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "SET_ALL_DOCUMENTS", payload: documents });
    });

    // Real-time listener for credits history
    const creditsQuery = query(
      collection(db, "creditHistory"),
      where("userId", "==", user.id),
      orderBy("date", "desc"),
      limit(25)
    );
    const unsubscribeCredits = onSnapshot(creditsQuery, (querySnapshot) => {
      const credits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "SET_USER_CREDITS", payload: credits });
    });

    // Real-time listener for previous transactions
    const transactionsQuery = query(
      collection(db, "paymentHistory"),
      where("userId", "==", user.id),
      orderBy("date", "desc"),
      limit(25)
    );
    const unsubscribeTransactions = onSnapshot(
      transactionsQuery,
      (querySnapshot) => {
        const transactions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({
          type: "SET_USER_PREVIOUS_TRANSACTIONS",
          payload: transactions,
        });
      }
    );
    const statsQuery = query(
      collection(db, "stats"),
      where(documentId(), "==", user.id)
    );
    const unsubscribeStats = onSnapshot(statsQuery, (querySnapshot) => {
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({
        type: "SET_USER_STATS",
        payload: transactions[0],
      });
    });

    // Clean up listeners on unmount or user change
    return () => {
      unsubscribeBills();
      unsubscribeDocuments();
      unsubscribeCredits();
      unsubscribeTransactions();
      unsubscribeStats();
    };
  }, [user]);

  return (
    <UserAssetsContext.Provider value={state}>
      <UserAssetsDispatchContext.Provider value={dispatch}>
        {children}
      </UserAssetsDispatchContext.Provider>
    </UserAssetsContext.Provider>
  );
};

// Custom Hooks for Accessing Context
export const useUserAssets = () => {
  const context = useContext(UserAssetsContext);
  if (!context) {
    throw new Error("useUserAssets must be used within a UserAssetsProvider");
  }
  return context;
};

export const useUserAssetsDispatch = () => {
  const context = useContext(UserAssetsDispatchContext);
  if (!context) {
    throw new Error(
      "useUserAssetsDispatch must be used within a UserAssetsProvider"
    );
  }
  return context;
};
