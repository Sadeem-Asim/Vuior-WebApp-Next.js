import CurrencyFormat from "react-currency-format";

const TablePayments = ({ paymentData }) => {
  return (
    <div className="rounded-lg bg-white px-6 pb-4 pt-6 shadow-md dark:bg-gray-dark dark:shadow-md">
      <h4 className="mb-6 font-bold text-lg text-dark dark:text-white text-center">
        Payments Overview
      </h4>

      {paymentData.length > 0 ? (
        <>
          {/* ✅ Desktop Table */}
          <div className="hidden md:block">
            {/* Table Headers */}
            <div className="grid grid-cols-5 border-b border-gray-300 text-button-gpt pb-3">
              <h5 className="text-sm font-medium text-center uppercase">
                Payment Date
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Savings
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Amount
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Payment Type
              </h5>
              <h5 className="text-sm font-medium text-center uppercase">
                Status
              </h5>
            </div>

            {paymentData.map((payment, key) => (
              <div
                className={`grid grid-cols-5 text-center py-3 ${
                  key === paymentData.length - 1
                    ? ""
                    : "border-b border-gray-300"
                }`}
                key={key}
              >
                {/* Date */}
                <p className="text-gray-800 dark:text-white">
                  {new Date(payment.date.seconds * 1000).toLocaleDateString()}
                </p>

                {/* Savings */}
                <p className="text-green-600 font-semibold">
                  <CurrencyFormat
                    value={formatCurrency(payment.savings)}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                  />
                </p>

                {/* Amount */}
                <p className="text-black font-semibold">
                  <CurrencyFormat
                    value={formatCurrency(payment.amount)}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="$"
                  />
                </p>

                {/* Type */}
                <p className="text-gray-700">
                  {payment.billIds.length > 1 ? "Consolidation" : "Single Bill"}
                </p>

                {/* Status */}
                <p
                  className={`font-medium ${
                    payment.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {payment.status}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {paymentData.map((payment, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Payment Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(payment.date.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-sm">Savings:</span>
                  <span className="text-green-600 font-semibold">
                    <CurrencyFormat
                      value={formatCurrency(payment.savings)}
                      displayType="text"
                      thousandSeparator={true}
                      prefix="$"
                    />
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-sm">Amount:</span>
                  <span className="text-black font-semibold">
                    <CurrencyFormat
                      value={formatCurrency(payment.amount)}
                      displayType="text"
                      thousandSeparator={true}
                      prefix="$"
                    />
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-sm">Type:</span>
                  <span className="text-gray-700">
                    {payment.billIds.length > 1
                      ? "Consolidation"
                      : "Single Bill"}
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-sm">Status:</span>
                  <span
                    className={`font-medium ${
                      payment.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700 dark:text-white">
          No payment records found.
        </p>
      )}
    </div>
  );
};

export default TablePayments;

// Currency formatter helper
const formatCurrency = (amount) => {
  return amount?.toString().includes(".")
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : `${amount}.00`;
};
