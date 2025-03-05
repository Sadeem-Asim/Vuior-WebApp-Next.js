import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { ClipLoader } from "react-spinners"; // Import ClipLoader

import {
  onAuthStateChanged,
  signOut,
  // User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { User } from "../types"; // Your custom user type
import { doc, onSnapshot } from "firebase/firestore";

// Define types for the user and context
interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create a context with a default value of `undefined`
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component that provides the authentication state and actions to the context
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Reference to the user's document in Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);

        // Set up a real-time listener for the user's document
        const unsubscribeUserDoc = onSnapshot(
          userDocRef,
          async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();

              // Map Firestore data to your User type
              const customUser = {
                id: firebaseUser.uid,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email || firebaseUser.email || "",
                role: userData.role || "user",
                avatar: userData.avatar || "",
                dob: userData.dob || "",
                address: userData.address || "",
                totalDocuments: userData.totalDocuments || 0,
                phoneNo: userData.phoneNo,
                referralCode: userData.referralCode,
                profileLink: userData.profileLink,
                redeemedReferralCode: userData.redeemedReferralCode,
                availableCredits: userData.availableCredits,
                createdAt: userData.createdAt,
                autoPay: userData.autoPay || false,
                defaultPaymentMethod: userData.defaultPaymentMethod || null,
                stripeCustomerId: userData.stripeCustomerId || null,
              };

              setUser(customUser);
            } else {
              console.warn(
                "No user document found for the authenticated user."
              );
              setUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error listening to user document:", error);
            setLoading(false);
          }
        );

        // Clean up the Firestore listener when the auth state changes
        return () => unsubscribeUserDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Clean up the auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    // Return a loading state or a placeholder if needed
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader size={150} color="#39b996" />
      </div>
    );

    // <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
