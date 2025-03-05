export interface User {
  defaultPaymentMethod?: string;
  phoneNo?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  dob: string;
  address: string;
  totalDocuments?: number;
  availableCredits?: number;
  profileLink?: string;
  referralCode?: string;
  redeemedReferralCode?: boolean;
  stripeCustomerId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
