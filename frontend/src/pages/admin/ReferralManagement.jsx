import React, { useState } from "react";
import { Users, DollarSign, ArrowUpRight, Search, IndianRupee } from "lucide-react";
import { RotatingLines } from "react-loader-spinner";
import { useGetAllReferralDataQuery } from "../../redux/slices/referralApiSlice";

const AdminReferralManagement = () => {


  const { data = {}, isLoading, isError, refetch } = useGetAllReferralDataQuery()
  
  console.log(data);

  const stats = {
    totalReferrals: 156,
    activeReferrals: 45,
    totalRewards: 78000,
    monthlyReferrals: 23,
  };

  const referralData = data.data || []

  const [searchTerm, setSearchTerm] = useState("");
  // const [filter, setFilter] = useState("all");

 

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeWidth="2"
          animationDuration="8"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Referrals</p>
              <h3 className="text-2xl font-bold mt-1">
                {data?.totalReferrals}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          {/* <div className="flex items-center mt-4 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>12% increase</span>
          </div> */}
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Referrals</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.activeReferrals}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>8% increase</span>
          </div>
        </div> */}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Rewards Paid</p>
              <h3 className="text-2xl font-bold mt-1">₹{data.totalRewardAmount}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <IndianRupee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          {/* <div className="flex items-center mt-4 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>15% increase</span>
          </div> */}
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Monthly Referrals</p>
              <h3 className="text-2xl font-bold mt-1">
                {stats.monthlyReferrals}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>5% increase</span>
          </div>
        </div> */}
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Referral History
          </h2>

          {/* Filters and Search */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by user or code..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Referrals</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select> */}
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Referrer
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Referee
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Code
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Reward
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {referralData.map((referral, i) => (
                  <tr key={referral.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{referral.referrerEmail}</td>
                    <td className="py-3 px-4">{referral.refereeEmail}</td>
                    <td className="py-3 px-4">{referral.referralCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${"bg-green-100 text-green-800"}`}
                      >
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-4">₹{referral.reward}</td>
                    <td className="py-3 px-4">
                      {new Date(referral.createdAt).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing 1 to 10 of {referralData.length} results
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReferralManagement;
