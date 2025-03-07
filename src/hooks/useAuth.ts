/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useToast } from "./use-toast";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  confirmPasswordReset,
  verifyPasswordResetCode,
  // onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
// } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const registerUser = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNo: string,
    timeZone: any,
    dob: string
  ) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        role: "user",
        phoneNo: phoneNo,
        avatar: DEFAULT_AVATAR,
        timeZone: timeZone,
        dob: dob,
        createdAt: new Date(),
      });

      // toast({
      //   title: "Account Created Successfully.",
      //   description: "Use your email and password to login again anytime.",
      // });

      setIsLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Unable to create account right now.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerAuthUser = async (
    email: string,
    password: string
    // firstName: string,
    // lastName: string,
    // phoneNo: string,
    // timeZone: any
  ) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a user document in Firestore
      // await setDoc(doc(db, 'users', user.uid), {
      //   email: user.email,
      //   firstName: firstName,
      //   lastName: lastName,
      //   role: 'user',
      //   phoneNo: phoneNo,
      //   avatar: DEFAULT_AVATAR,
      //   timeZone: timeZone,
      //   createdAt: new Date()
      // })

      // toast({
      //   title: "Account Created Successfully.",
      //   description: "Use your email and password to login again anytime.",
      // });

      setIsLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Unable to create account right now.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // console.log("cheel", userData);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        throw new Error("User data not found");
      }

      setIsLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description:
          "Unable to log in. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  const handleGoogleSignIn = async (googleProvider: any) => {
    setIsLoading(true);
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New User - Create a Firestore document
        await setDoc(userDocRef, {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "Unknown",
          lastName: user.displayName?.split(" ")[1] || "User",
          phoneNo: user.phoneNumber || "",
          avatar: user.photoURL || DEFAULT_AVATAR,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          dob: "", // DOB is not available from Google Sign-In, you may ask later
          createdAt: new Date(),
        });

        toast({
          title: "Account Created",
          description: `Welcome, ${user.displayName}!`,
        });
      } else {
        // Existing User - Just log in
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.displayName}!`,
        });
      }

      setIsLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error("Google Sign-In Error: ", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Google Sign-In Failed. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendResetPasswordEmail = async (email: string) => {
    const continueUrl = "http://localhost:5173/"; // Replace with your desired redirect URL

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, { url: continueUrl });

      setIsLoading(false);
    } catch (error) {
      console.error("Password reset error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      setIsLoading(false);
      toast({
        title: "Logout Successful",
        description: "",
      });
      // navigate("/");
      // window.location.reload();

      console.log("User successfully logged out.");
      // Optionally redirect the user or update your UI
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Unable to log out. Please try again.",
        variant: "destructive",
      });
      console.error("Error during logout:", error);
    }
  };

  const resetPassword = async (oobCode: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await verifyPasswordResetCode(auth, oobCode);

      // Confirm the password reset with the new password
      await confirmPasswordReset(auth, oobCode, newPassword);

      setIsLoading(false);
    } catch (error) {
      console.error("Password reset error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // console.log(...context)

  let isAuthenticated: boolean;
  if (!context.user) {
    isAuthenticated = false;
  } else {
    isAuthenticated = true;
  }

  // console.log('mali', context.user)
  return {
    ...context,
    isAuthenticated,
    user: context.user,
    registerUser,
    registerAuthUser,
    handleGoogleSignIn,
    // registerFirebaseUser,
    login,
    sendResetPasswordEmail,
    logout,
    resetPassword,
    isLoading,
  };
};
