import { Tooltip } from "@mui/material";
import React from "react";
import CurrencyFormat from "react-currency-format";

// Define the type for a single credit document
interface CreditDoc {
  credits: number;
  date: { seconds: number; nanoseconds: number };
  reference: string;
  status: string;
  type: string;
  userId: string;
}

interface TableCreditsProps {
  creditDocs: CreditDoc[];
}

const TableCredits: React.FC<TableCreditsProps> = ({ creditDocs }) => {
  console.log("Credits Data:", creditDocs);

  return (
    <div className="rounded-lg bg-white px-6 pb-4 pt-6 shadow-md dark:bg-gray-dark dark:shadow-md">
      <h4 className="mb-6 font-bold text-lg text-dark dark:text-white text-center">
        Credits History
      </h4>

      {creditDocs.length > 0 ? (
        <>
          {/* ✅ Desktop Table Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 text-button-gpt border-b border-gray-300 pb-3">
              <h5 className="text-sm font-medium text-center uppercase">
                Date
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Reference
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Type
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Credit Amount
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Status
              </h5>
            </div>

            {creditDocs.map((credit, key) => (
              <div
                className={`grid grid-cols-5 text-center py-3 ${
                  key === creditDocs.length - 1
                    ? ""
                    : "border-b border-gray-300"
                }`}
                key={key}
              >
                <p className="text-gray-700 dark:text-white">
                  {new Date(credit.date.seconds * 1000).toLocaleDateString()}
                </p>

                <Tooltip title={credit.reference} arrow>
                  <p className="text-gray-700 dark:text-white">
                    {truncateString(credit.reference, 15)}
                  </p>
                </Tooltip>

                <p className="text-gray-700 dark:text-white">{credit.type}</p>

                <p
                  className="font-semibold"
                  style={{ color: credit.credits > 0 ? "green" : "red" }}
                >
                  <CurrencyFormat
                    value={`${credit.credits.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </p>

                <p
                  className={`font-medium ${
                    credit.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {credit.status}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Mobile Column Layout */}
          <div className="md:hidden flex flex-col gap-4">
            {creditDocs.map((credit, key) => (
              <div
                key={key}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(credit.date.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Reference:</span>
                  <Tooltip title={credit.reference} arrow>
                    <span className="text-gray-900 dark:text-white">
                      {truncateString(credit.reference, 15)}
                    </span>
                  </Tooltip>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Type:</span>
                  <span className="text-gray-900 dark:text-white">
                    {credit.type}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Credit Amount:</span>
                  <span
                    className="font-semibold"
                    style={{ color: credit.credits > 0 ? "green" : "red" }}
                  >
                    <CurrencyFormat
                      value={`${credit.credits.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}`}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Status:</span>
                  <span
                    className={`font-medium ${
                      credit.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {credit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700 dark:text-white">
          No credit transactions available.
        </p>
      )}
    </div>
  );
};

export default TableCredits;

/* Truncate Long Reference Strings */
function truncateString(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}
