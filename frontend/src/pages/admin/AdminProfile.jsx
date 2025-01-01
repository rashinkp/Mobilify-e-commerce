import React from 'react'
import { useGetAdminDataQuery } from '../../redux/slices/adminApiSlices'
import { RotatingLines } from 'react-loader-spinner';

const AdminProfile = () => {
  const { data = {}, isLoading, isError, refetch } = useGetAdminDataQuery()

  console.log(data);
  

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
    <div>AdminProfile</div>
  )
}

export default AdminProfile