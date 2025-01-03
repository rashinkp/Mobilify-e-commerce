import React, { useEffect, useState } from "react";
import {
  useAddAmountMutation,
  useGetWalletQuery,
} from "../../redux/slices/walletApiSlice";
import { RotatingLines } from "react-loader-spinner";
import { ChevronRight, Home, User, Wallet } from "lucide-react";
import { errorToast, successToast } from "../../components/toast/index.js";
import { Link, useLocation } from "react-router";

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addMoney] = useAddAmountMutation();
  const [transactions, setTransactions] = useState([]);

  const { data = {}, isLoading, refetch } = useGetWalletQuery();

  useEffect(() => {
    setBalance(data?.wallet?.balance || 0);
    setTransactions(data?.transactions);
  }, [data]);


  const isWalletPage = useLocation().pathname.includes("wallet");

  

  const handlePayment = async (amount) => {
    const options = {
      key: "rzp_test_K5otU6Q5C8lSi8",
      amount: amount * 100,
      currency: "INR",
      name: "Mobilify",
      description: "Wallet Recharge",
      handler: async function (response) {
        try {
          const result = await addMoney({
            amount: parseFloat(amount),
            paymentId: response.razorpay_payment_id,
            description: "Added funds via Razorpay",
          });

          if (result.error) {
            errorToast("Failed to add funds");
            return;
          }

          successToast("Amount added to wallet successfully!");
          setAmount("");
          setShowAddFunds(false);
          refetch();
        } catch (error) {
          errorToast("Error processing payment");
          console.error("Payment error:", error);
        }
      },
      prefill: {
        name: data?.wallet?.user?.name || "",
        email: data?.wallet?.user?.email || "",
        contact: data?.wallet?.user?.phone || "",
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: () => {
          errorToast("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      errorToast("Please enter a valid amount");
      return;
    }

    try {
      handlePayment(parseFloat(amount));
    } catch (error) {
      errorToast("Error initiating payment");
      console.error("Payment initiation error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeColor="#fff"
          strokeWidth="2"
          animationDuration="8"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <>
      {isWalletPage && (
        <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-white">
              <Link
                to="/user"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <Link
                to="/user/profile"
                className="text-white hover:text-white/80 transition-colors flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
              <span className="font-medium">Wallet</span>
            </div>
          </div>
        </div>
      )}

      <div className={`${isWalletPage && "pt-20"} w-full mx-auto p-4`}>
        {/* Main Balance Card */}
        <div className="mb-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-lg opacity-90">Available Balance</p>
                <h2 className="text-3xl font-bold mt-2">
                  ₹
                  {balance?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? "0.00"}
                </h2>
              </div>
              <div className="w-12 h-12 text-white opacity-80">
                <Wallet size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Section */}
        <div className="mb-6 bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Wallet />
              Add Funds
            </h3>
            <div className="mt-4">
              {showAddFunds ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddFunds}
                      className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddFunds(false);
                        setAmount("");
                      }}
                      className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add New Funds
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {transaction.description}
                      </th>
                      <td className="px-6 py-4">
                        {new Date(transaction.createdAt).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">{transaction.type}</td>
                      <td
                        className={`px-6 py-4 font-medium ${
                          transaction.type === "Credit"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "Credit" ? "+" : "-"}₹
                        {transaction.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) ?? "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletDashboard;
