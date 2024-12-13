import { Edit } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetUserQuery } from '../redux/slices/userApiSlices';

const MyProfile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { userInfo } = useSelector((state) => state.userAuth);
  const { data, isLoading, isError, error } = useGetUserQuery(userInfo.id);
  const { user } = data || {};


  

  if (isError) return <div>Error: {error.message}</div>;
  
  
     if (isLoading ) {
       return (
         <div>
           <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
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
         </div>
       );
     }
  

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">
          My Profile
        </h1>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-slate-800  p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white text-gray-700">
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Edit size={16} className="mr-2" />
                {isEditingProfile ? "Cancel" : "Edit"}
              </button>
            </div>

            {!isEditingProfile ? (
              <div>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full dark:bg-black dark:border-none p-2 border rounded-md"
                  value={user.name}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border dark:bg-black dark:border-none rounded-md"
                  value={user.email}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Save Changes
                </button>
              </div>
            )}
          </div>

          
        </div>
      </div>
    </>
  );
}

export default MyProfile