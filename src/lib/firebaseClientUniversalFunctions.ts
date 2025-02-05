/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getFirestore,
  addDoc,
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import axios from "axios";
// Initialize Firebase app using environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log(auth);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
async function storeOTP(email: string, otp: string) {
  // Set expiry 10 minutes in the future
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);

  const documentsCollection = collection(db, "otpVerifications");
  await addDoc(documentsCollection, {
    otp: otp,
    email: email,
    expiry: expiry,
  });
}

async function checkIfEmailExists(email: string) {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    if (signInMethods.length > 0) {
      console.log("Email is already registered.");
      return true; // Email exists in Firebase Authentication
    } else {
      console.log("Email is not registered.");
      return false; // Email is not in Firebase Authentication
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return false; // Handle errors (e.g., invalid email format)
  }
}

export async function sendEmailVerificationOTP(
  email: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the email exists in Firebase Authentication
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return {
        success: false,
        error: "Email is not registered in Firebase Authentication.",
      };
    }

    console.log(email);
    const otp = generateOTP();
    await storeOTP(email, otp);

    const formData = {
      subject: `OTP Verification for VUIOR`,
      description: `Hello ${firstName},

      Thank you for registering with VUIOR. Please use the following OTP to verify your account:

      OTP: ${otp}

      This OTP is valid for 5 minutes. If you did not request this, please ignore this email.

      Best Regards,
      The VUIOR Team`,
      name: firstName,
      email: email,
      otp: otp,
    };

    const accessKey = "C63SwSugFYkrclqIedXCPkaGoyEh8MIEkNRO";
    const channelId = "367dbe7b-7e2b-5be1-a4c7-6327128b7b6b";
    const workspaceId = "f8f5bb9b-7243-48d8-9bcc-29b3792a27aa";
    const url = `https://api.bird.com/workspaces/${workspaceId}/channels/${channelId}/messages`;

    const data = {
      receiver: {
        contacts: [{ identifierValue: email }],
      },
      body: {
        type: "html",
        html: {
          metadata: {
            subject: formData.subject,
          },
          html: `
          <p>${formData.subject}</p>
          <ul>
            <li><strong>Name:</strong> ${formData.name}</li>
            <li><strong>Email:</strong> ${formData.email}</li>
            <li><strong>Message:</strong> ${formData.description}</li>
            <li><strong>OTP:</strong> ${formData.otp}</li>
          </ul>
          <div style="width:500px; background-color:#10a37f; text-align:center; justify-content:center; color:white; border-radius:05px;">
          </div>
          `,
          text: `
            Subject: ${formData.subject}
            Name: ${formData.name}
            Email: ${formData.email}
            Message: ${formData.description}
            OTP: ${formData.otp}
          `,
        },
      },
    };

    const headers = {
      Authorization: `AccessKey ${accessKey}`,
      "Content-Type": "application/json",
    };

    await axios.post(url, data, { headers });

    return { success: true }; // ✅ Return success if everything works
  } catch (error: any) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message || "Unknown error occurred" }; // ❌ Return error message
  }
}

export async function verifyOTP(
  email: string,
  enteredOTP: string
): Promise<{ success: boolean; error?: string }> {
  console.log(email, enteredOTP);
  try {
    const otpCollection = collection(db, "otpVerifications");

    // Query Firestore where email matches and OTP matches
    const q = query(
      otpCollection,
      where("email", "==", email),
      where("otp", "==", enteredOTP) // Ensure OTP matches
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid OTP or email." };
    }

    let otpDocRef = null;
    let expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() - 10);

    querySnapshot.forEach((doc) => {
      otpDocRef = doc.ref;
      expiryTime = doc.data().expiry.toDate(); // Convert Firestore timestamp to Date object
    });

    if (!otpDocRef || !expiryTime) {
      return {
        success: false,
        error: "OTP verification failed due to missing data.",
      };
    }

    // Check if the OTP has expired
    if (new Date() > expiryTime) {
      return {
        success: false,
        error: "OTP has expired. Please request a new one.",
      };
    }

    // OTP is valid, delete the document after verification
    await deleteDoc(otpDocRef);

    return { success: true }; // ✅ OTP verified successfully
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred during OTP verification.",
    };
  }
}
