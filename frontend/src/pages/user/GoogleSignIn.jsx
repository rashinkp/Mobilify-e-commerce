// import React from "react";
// import { GoogleLogin, useGoogleLogin } from "react-google-login";
// import { useGoogleSignMutation } from "../../redux/slices/userApiSlices";

// const clientId =
//   "1082671163898-isei5ie78erkjd5434c5i9umc4n18lom.apps.googleusercontent.com"; //

// const GoogleSignIn = () => {
//   const [googleSign] = useGoogleSignMutation();

//   const onSuccess = async (response) => {
//     console.log("Login Success:", response);
//     const tokenId = response.tokenId;

//     try {
//       const result = await googleSign({ token: tokenId }).unwrap();
//       console.log("JWT Token:", result);
//     } catch (error) {
//       console.error("Error during Google sign-in:", error);
//     }
//   };

//   const onFailure = (response) => {
//     console.error("Login Failed:", response);
//   };

//   return (
//     <div>
//       <h2>Google Sign-In</h2>
//       <GoogleLogin
//         clientId={clientId}
//         buttonText="Sign in with Google"
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         cookiePolicy={"single_host_origin"}
//       />
//       <div class="g-signin2" data-onsuccess="onSignIn"></div>
//     </div>
//   );
// };

// export default GoogleSignIn;
