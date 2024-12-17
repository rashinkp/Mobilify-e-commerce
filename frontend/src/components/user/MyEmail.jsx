import { Edit } from "lucide-react";
import { useState } from "react";
import { useGetUserQuery } from "../../redux/slices/userApiSlices";

const MyEmail = () => {
  const { data, isLoading, isError, error } = useGetUserQuery();
  const { user } = data || {};

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [newEmail, setNewEmail] = useState(email);

  const handleSave = (e) => {
    e.preventDefault();
    setEmail(newEmail);
    setIsEditingProfile(false);
  };

  const handleCancel = () => {
    setNewEmail(email);
    setIsEditingProfile(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">
        My Email
      </h1>

      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white text-gray-700">
              Personal Information
            </h2>
            {/* <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <Edit size={16} className="mr-2" />
              {isEditingProfile ? "Cancel" : "Edit"}
            </button> */}
          </div>

          {!isEditingProfile ? (
            <div>
              <p>
                <strong>Email:</strong> {email || "No email specified"}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-2 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-2 border dark:bg-black dark:border-none rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEmail;
