/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  //   getDoc,
  doc,
  updateDoc,
  Timestamp,
  // DocumentReference,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase config

// Interface representing a Bill entity with DocumentReference for referenced fields
interface Bill {
  id?: string;
  user_id: any; // Changed from string to DocumentReference
  biller_id?: any; // Changed from string to DocumentReference
  amount: number;
  due_date: string;
  status: string;
  payment_method_id: any; // Changed from string to DocumentReference
  early_payment_savings?: number;
  is_consolidated?: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  remainingAmount?: any;
  pastDue?: any;
  accountNumber: any;
  isDeleted?: boolean;
}

// Create a new bill in Firestore
const createBill = async (billData: Bill): Promise<string> => {
  try {
    billData.created_at = Timestamp.now();
    billData.updated_at = Timestamp.now();
    billData.isDeleted = false;

    // Adding the bill document to Firestore
    const billRef = await addDoc(collection(db, "bills"), billData);

    console.log("Bill created with ID:", billRef.id);
    return billRef.id;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw new Error("Error creating bill");
  }
};

// Fetch a bill along with its populated references (user, biller, payment method)
const fetchBillsForSpecificUser = async (userId: string) => {
  try {
    // Convert user_id to a DocumentReference
    const userRef = doc(db, "users", userId);

    // Create a query to get bills where the user_id field matches the user reference
    const billsQuery = query(
      collection(db, "bills"),
      where("user_id", "==", userRef),
      where("isDeleted", "==", false)
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

// Update an existing bill with new data
const updateBill = async (
  billId: string,
  updatedData: Partial<Bill>
): Promise<void> => {
  try {
    const billDocRef = doc(db, "bills", billId);
    await updateDoc(billDocRef, updatedData);
    console.log("Bill updated successfully");
  } catch (error) {
    console.error("Error updating bill:", error);
    throw new Error("Error updating bill");
  }
};

// Delete a bill from Firestore
const deleteBill = async (billId: string): Promise<void> => {
  try {
    const billDocRef = doc(db, "bills", billId);
    await updateDoc(billDocRef, {
      isDeleted: true,
    });
    console.log("Bill marked as deleted successfully");
  } catch (error) {
    console.error("Error marking bill as deleted:", error);
    throw new Error("Error marking bill as deleted");
  }
};

// Function to populate references using the Firestore DocumentReference
// const populateReferenceLocal = async (ref: DocumentReference) => {
//   try {
//     const refDoc = await getDoc(ref)
//     if (refDoc.exists()) {
//       return refDoc.data()
//     } else {
//       throw new Error('Reference not found')
//     }
//   } catch (error) {
//     console.error('Error fetching reference:', error)
//     throw new Error('Error populating reference')
//   }
// }

export { createBill, fetchBillsForSpecificUser, updateBill, deleteBill };
