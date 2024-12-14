// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   useGetUserQuery,
//   useUpdateUserMutation,
//   useVerifyOtpMutation,
// } from "../redux/slices/userApiSlices";
// import { Edit, Clock } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import {
//   emailValidation,
//   nameValidation,
//   otpValidationSchema,
// } from "../validationSchemas";
// import { errorToast, successToast } from "./toast";

// // Validation schemas
// const validationSchema = Yup.object().shape({
//   name: nameValidation,
//   email: emailValidation,
// });

// const MyEmail = () => {
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [isOtpRequired, setIsOtpRequired] = useState(false);
//   const [pendingEmail, setPendingEmail] = useState("");
//   const [otpCountdown, setOtpCountdown] = useState(300);
//   const [isOtpExpired, setIsOtpExpired] = useState(false);

//   const { userInfo } = useSelector((state) => state.userAuth);
//   const { data, isLoading, isError, error } = useGetUserQuery(userInfo.id);
//   const { user } = data || {};
//   const [updateUser] = useUpdateUserMutation();

//   const [verifyOtp] = useVerifyOtpMutation();

//   // Profile edit form
//   const {
//     register: registerProfile,
//     handleSubmit: handleProfileSubmit,
//     watch,
//     setValue,
//     formState: { errors: profileErrors, isDirty },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       email: "",
//     },
//     resolver: yupResolver(validationSchema),
//   });

//   // OTP verification form
//   const {
//     register: registerOtp,
//     handleSubmit: handleOtpSubmit,
//     reset: resetOtp,
//     formState: { errors: otpErrors },
//   } = useForm({
//     resolver: yupResolver(otpValidationSchema),
//   });

//   // Countdown timer effect
//   useEffect(() => {
//     let timerId;
//     if (isOtpRequired && otpCountdown > 0) {
//       timerId = setInterval(() => {
//         setOtpCountdown((prevCount) => {
//           if (prevCount <= 1) {
//             clearInterval(timerId);
//             setIsOtpExpired(true);
//             return 0;
//           }
//           return prevCount - 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       if (timerId) clearInterval(timerId);
//     };
//   }, [isOtpRequired, otpCountdown]);

//   // Format countdown time
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
//   };

//   // Populate form with user data
//   useEffect(() => {
//     if (user) {
//       setValue("name", user.name || "");
//       setValue("email", user.email || "");
//     }
//   }, [user, setValue]);

//   const onProfileSubmit = async (formData) => {
//     try {
//       // Check if email is changing
//       const isEmailChanging = formData.email !== user.email;

//       // Update user profile
//       await updateUser(formData);

//       if (isEmailChanging) {
//         setPendingEmail(formData.email);
//         setIsOtpRequired(true);
//         setOtpCountdown(300);
//         setIsOtpExpired(false);
//         successToast("Please verify your new email address.");
//         setIsEditingProfile(false);
//       } else {
//         setIsEditingProfile(false);
//         successToast("Profile updated successfully.");
//       }
//     } catch (error) {
//       console.error("Error updating user:", error);
//       errorToast(error?.data?.message || error?.message || "Error occurred");
//       setIsEditingProfile(false);
//     }
//   };

//   const onOtpVerify = async (formData) => {
//     try {
//       if (isOtpExpired) {
//         errorToast("OTP has expired. Please request a new one.");
//         return;
//       }

//       await verifyOtp(formData).unwrap();

//       successToast(`Email changed to ${pendingEmail} successfully`);
//       setIsOtpRequired(false);
//       setPendingEmail("");
//       resetOtp();
//       setOtpCountdown(0);
//     } catch (error) {
//       const errorMessage =
//         error?.data?.message || "OTP verification failed. Please try again.";

//       errorToast(errorMessage);
//     }
//   };

//   const handleResendOtp = () => {
//     // Implement OTP resend logic here
//     setOtpCountdown(300);
//     setIsOtpExpired(false);
//     resetOtp();
//     successToast("New OTP sent to your email");
//   };

//   const watchFields = watch();

//   const isUnchanged =
//     watchFields.name === user?.name && watchFields.email === user?.email;

//   if (isError) return <div>Error: {error.message}</div>;

//   if (isLoading) {
//     return (
//       <div>
//         <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div>
//         <h1 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">
//           My Email
//         </h1>

//         <div className="space-y-4">
//           <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold dark:text-white text-gray-700">
//                 Personal Information
//               </h2>
//               <button
//                 onClick={() => setIsEditingProfile(!isEditingProfile)}
//                 className="text-blue-600 hover:text-blue-700 flex items-center"
//               >
//                 <Edit size={16} className="mr-2" />
//                 {isEditingProfile ? "Cancel" : "Edit"}
//               </button>
//             </div>

//             {!isEditingProfile ? (
//               <div>
//                 <p>
//                   <strong>Email:</strong> {user.email}
//                 </p>
//               </div>
//             ) : (
//               <form
//                 onSubmit={handleProfileSubmit(onProfileSubmit)}
//                 className="space-y-4"
//               >
//                 <div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     className="w-full p-2 border dark:bg-black dark:border-none rounded-md"
//                     {...registerProfile("email")}
//                   />
//                   {profileErrors.email && (
//                     <p className="text-red-500 text-sm">
//                       {profileErrors.email.message}
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
//                   disabled={isUnchanged || !isDirty}
//                 >
//                   Save Changes
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* OTP form */}
//           {isOtpRequired && (
//             <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg mt-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold dark:text-white text-gray-700">
//                   Verify your new email
//                 </h2>
//                 <div className="flex items-center text-red-600">
//                   <Clock size={16} className="mr-2" />
//                   <span className="font-bold">{formatTime(otpCountdown)}</span>
//                 </div>
//               </div>
//               <p className="mb-2">
//                 An OTP has been sent to {pendingEmail}. Please enter the code
//                 below.
//               </p>
//               <form
//                 onSubmit={handleOtpSubmit(onOtpVerify)}
//                 className="space-y-4"
//               >
//                 <div>
//                   <input
//                     type="text"
//                     name="otp"
//                     placeholder="Enter OTP"
//                     className="w-full p-2 border dark:bg-black dark:border-none rounded-md"
//                     {...registerOtp("otp")}
//                     disabled={isOtpExpired}
//                   />
//                   {otpErrors.otp && (
//                     <p className="text-red-500 text-sm">
//                       {otpErrors.otp.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     disabled={isOtpExpired}
//                   >
//                     Submit OTP
//                   </button>
//                   {isOtpExpired && (
//                     <button
//                       type="button"
//                       onClick={handleResendOtp}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       Resend OTP
//                     </button>
//                   )}
//                 </div>
//               </form>
//               {isOtpExpired && (
//                 <p className="text-red-500 text-sm mt-2">
//                   OTP has expired. Please request a new one.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MyEmail;
