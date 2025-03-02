import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase config

// Create a new bill in Firestore

// Fetch bills for a specific user
const fetchBillsForSpecificUser = async (userId) => {
  try {
    // Convert user_id to a DocumentReference
    const userRef = doc(db, "users", userId);

    // Create a query to get bills where the user_id field matches the user reference
    const billsQuery = query(
      collection(db, "bills"),
      where("user_id", "==", userRef)
    );

    // Execute the query to fetch bills
    const querySnapshot = await getDocs(billsQuery);

    // Create an array of bills from the querySnapshot
    const bills = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return bills; // Return the array of bills
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw new Error("Error fetching bills");
  }
};

// Fetch bills for a specific user
const fetchDocumentsForSpecificUser = async (userId) => {
  try {
    console.log("userId");
    // Convert user_id to a DocumentReference
    const userRef = doc(db, "users", userId);

    // Create a query to get bills where the user_id field matches the user reference
    const documentsQuery = query(
      collection(db, "documents"),
      where("userId", "==", userId),
      where("isDeleted", "==", false)
    );

    // Execute the query to fetch bills
    const querySnapshot = await getDocs(documentsQuery);

    // Create an array of bills from the querySnapshot
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documents; // Return the array of bills
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Error fetching documents");
  }
};

// Update an existing bill with new data

// Fetch bills for a specific user
const fetchCreditHistoryForSpecificUser = async (userId) => {
  try {
    const creditHistoryQuery = query(
      collection(db, "creditHistory"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    // Execute the query to fetch credit history
    const querySnapshot = await getDocs(creditHistoryQuery);

    // Create an array of credit history records from the querySnapshot
    const creditHistory = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return creditHistory; // Return the sorted array of credit history
  } catch (error) {
    console.error("Error fetching credit history:", error);
    throw new Error("Error fetching credit history");
  }
};

export {
  fetchBillsForSpecificUser,
  fetchDocumentsForSpecificUser,
  fetchCreditHistoryForSpecificUser,
};
