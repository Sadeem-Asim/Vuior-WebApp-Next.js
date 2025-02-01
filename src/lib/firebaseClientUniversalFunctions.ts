// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { FirebaseApp, initializeApp } from "firebase/app";

// // Initialize Firebase app
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
//   measurementId: import.meta.env.VITE_MEASUREMENT_ID,
// };

// const app: FirebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Universal function to populate reference field
// export async function populateReference(
//   referenceField: any, // Reference field in the main object
//   tableName: string, // The collection name of the referenced document
//   mainObject: any // The main object where the referenced data will be populated
// ): Promise<any> {
//   try {
//     // Get reference field from main object (assume it's a reference)
//     const reference = mainObject[referenceField];
//     if (!reference) {
//       console.log(`No reference found in the field: ${referenceField}`);
//       return mainObject; // Return the main object without modification
//     }

//     // Get the referenced document ID from the reference field
//     const docRef = doc(db, tableName, reference.id); // Assuming the reference contains an `id` field
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const referencedData = docSnap.data(); // Get the referenced data
//       const populatedObject = {
//         ...mainObject,
//         [referenceField]: referencedData, // Attach the referenced data to the main object
//       };
//       return populatedObject;
//     } else {
//       console.log(`No document found for reference: ${reference.id}`);
//       return mainObject; // Return the main object without modification
//     }
//   } catch (error) {
//     console.error("Error populating reference:", error);
//     return mainObject; // Return the main object in case of error
//   }
// }





























import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithPhoneNumber,
  sendEmailVerification,
  User
} from 'firebase/auth'

// Initialize Firebase app using environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

const app: FirebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

/**
 * Dummy app verifier that bypasses reCAPTCHA.
 * This object conforms to the interface expected by signInWithPhoneNumber,
 * but it simply returns a resolved promise. Use only for development/testing.
 */
const dummyAppVerifier = {
  type: 'recaptcha',
  verify: () => Promise.resolve('dummy-token')
}

/**
 * Universal function to populate a reference field.
 *
 * @param referenceField - The field name in the main object that contains the reference.
 * @param tableName - The collection name where the referenced document is stored.
 * @param mainObject - The object containing the reference field.
 * @returns The main object with the referenced data populated (if found).
 */
export async function populateReference (
  referenceField: string,
  tableName: string,
  mainObject: any
): Promise<any> {
  try {
    const reference = mainObject[referenceField]
    if (!reference) {
      console.log(`No reference found in the field: ${referenceField}`)
      return mainObject
    }

    // Assuming the reference object contains an 'id' property.
    const docRef = doc(db, tableName, reference.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const referencedData = docSnap.data()
      return {
        ...mainObject,
        [referenceField]: referencedData
      }
    } else {
      console.log(`No document found for reference: ${reference.id}`)
      return mainObject
    }
  } catch (error) {
    console.error('Error populating reference:', error)
    return mainObject
  }
}

/**
 * Sends a phone OTP using Firebase Auth with a dummy app verifier.
 *
 * @param phoneNumber - The phone number to which the OTP will be sent.
 */
export async function sendPhoneOTP (phoneNumber: string): Promise<void> {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      dummyAppVerifier
    )
    // Save confirmationResult globally to verify the OTP later.
    ;(window as any).confirmationResult = confirmationResult
    console.log('OTP sent to phone number:', phoneNumber)
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}

/**
 * Sends an email verification link to the user's email.
 *
 * @param user - The currently signed-in Firebase User.
 */
export async function sendEmailVerificationOTP (user: User): Promise<void> {
  try {
    await sendEmailVerification(user)
    console.log('Verification email sent to:', user.email)
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}
