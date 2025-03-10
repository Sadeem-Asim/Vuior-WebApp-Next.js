import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "../pages/home";
import ContactUs from "../pages/contact-us";
import ErrorPage from "../components/redesigned-components/components/error-element";
import ConsultePage from "../pages/consulte";
import HowItWorks from "../pages/how-it-works";
import FaqsPage from "../pages/faqs-page";
import AboutPage from "../pages/about-us";
import CareersPage from "../pages/careers-page";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "../pages/login-page";
import RegisterUser from "../pages/register-user";
import ForgetPassword from "../pages/forget-password";
import DashboardHome from "../pages/dashboardHome";
import PayEarly from "../pages/payEarly";
import SetupAutoPay from "@/pages/setupAutoPay";
import Transaction from "../pages/transaction";
// import ResetPassword from "../pages/reset-pasword";
import OpenPositions from "../pages/open-positions";
import JobDetails from "../pages/job-details";
import JobApplication from "../pages/job-application";
import JobLayout, { loader as jobLoader } from "./layouts/JobLayout";
import Refresh from "../components/redesigned-components/components/refresh";
import PrivacyPolicy from "../pages/privacy-policy";
import TermsOfService from "../pages/terms-of-service";
import CookiesPolicies from "../pages/cookies-policies";
import DataProtectionPolicy from "../pages/data-protection";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Calendar from "../pages/calendar/page";
import Profile from "../pages/profile";
import CreditTransaction from "../pages/creditTransaction";

import Dashboard from "../pages/Dashboard";
import RewardTracker from "../pages/reward-tracker";
import Refer from "../pages/refer";
import CreateBill from "../components/ui/billForm/form";

import PaymentHistory from "../pages/payments-history";
import DocumentPage from "@/pages/documents";
const stripeApiKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import DashboardSettings from "../pages/DashboardSettings"
const stripePromise = loadStripe(stripeApiKey);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            element: <LoginPage />,
            path: "login",
          },
          {
            element: <ForgetPassword />,
            path: "forget-password",
          },
          // {
          //   element: <ResetPassword />,
          //   path: "reset-password",
          // },
          {
            element: <RegisterUser />,
            path: "create-account",
          },
          {
            path: "/consultation",
            element: <ConsultePage />,
          },
        ],
      },

      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/careers",
        element: <CareersPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/cookies-policy",
        element: <CookiesPolicies />,
      },
      {
        path: "/data-protection-policy",
        element: <DataProtectionPolicy />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
      {
        path: "/careers/open-positions",
        element: <OpenPositions />,
      },
      {
        element: <JobLayout />,
        loader: jobLoader,
        errorElement: <Refresh />,
        children: [
          {
            path: "/careers/jobs/:id",
            element: <JobDetails />,
          },

          {
            path: "/careers/jobs/:id/application",
            element: <JobApplication />,
          },
        ],
      },

      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "/faqs",
        element: <FaqsPage />,
      },
    ],
  },

  {
    path: "dashboard",
    loader: jobLoader,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
    ],
  },

  {
    path: "bills",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "create/:upload",
        element: <CreateBill />,
      },
    ],
  },

  {
    path: "payEarly",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PayEarly />,
      },
    ],
  },
  {
    path: "setupAutoPay",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Elements stripe={stripePromise}>
            <SetupAutoPay />
          </Elements>
        ),
      },
    ],
  },

  {
    path: "transaction",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Transaction />,
      },
      {
        path: "/transaction/credit/add",
        // index: true,
        element: <CreditTransaction add={true} />,
      },
      {
        path: "/transaction/credit/send",
        // index: true,
        element: <CreditTransaction add={false} />,
      },
    ],
  },

  {
    path: "documents",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DocumentPage />,
      },
    ],
  },

  {
    path: "payment-history",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PaymentHistory />,
      },
    ],
  },

  {
    path: "credit-tracker",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <RewardTracker />,
      },
    ],
  },

  {
    path: "refer",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Refer />,
      },
    ],
  },

  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Profile />,
      },
    ],
  },

  {
    path: "organizer",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Calendar />,
      },
    ],
  },
]);
