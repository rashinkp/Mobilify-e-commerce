import React, { useState } from "react";
import { Copy, Plus, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import {
  useCreateReferralCodeMutation,
  useGetUserReferralsQuery,
} from "../../redux/slices/referralApiSlice";
import { RotatingLines } from "react-loader-spinner";

const ReferralManagement = () => {
  const [generateCode] = useCreateReferralCodeMutation();
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const { data = {}, isLoading, refetch } = useGetUserReferralsQuery();

  const generateNewCode = async () => {
    try {
      await generateCode().unwrap();
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  console.log(data);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 2000);
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {showCopiedAlert && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">Referral code copied to clipboard!</p>
        </div>
      )}

      {/* Referral Code Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Referral Code
          </h2>
          {!data.referralCode && (
            <button
              onClick={generateNewCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generate Code
            </button>
          )}
        </div>

        {data?.referralCode ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-4 bg-gray-50 px-6 py-4 rounded-lg w-full">
              <span className="text-2xl font-mono font-semibold text-gray-700">
                {data?.referralCode}
              </span>
              <button
                onClick={() => copyToClipboard(data?.referralCode)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy referral code"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-gray-600">
              Share this code with your friends to earn rewards upto 250 Rs.!
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You don't have an active referral code yet. Generate one to start
            earning rewards!
          </p>
        )}
      </div>

      {/* Referral History Section */}
      {data?.userReferrals?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Referral History
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-semibold text-gray-600">
                      Used By
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600">
                      Used Date
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.userReferrals.map((referral, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">{referral?.userDetails?.email || "-"}</td>
                      <td className="py-3 px-4">
                        {referral.createdAt
                          ? new Date(referral.createdAt).toLocaleDateString(
                              "en-US"
                            )
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-green-600">₹{referral?.reward || 250}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Referral Stats Section */}
      {data?.referredBy?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            You Were Referred By
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Referrer
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.referredBy.map((referral, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{referral.referrer}</td>
                    <td className="py-3 px-4">
                      {new Date(referral.date).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;
