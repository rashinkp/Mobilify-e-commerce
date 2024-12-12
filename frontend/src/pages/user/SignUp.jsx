import React, { useEffect, useState } from "react";
import Form from "../../components/Form.jsx";
import { signUpValidationSchema } from "../../validationSchemas";
import SignGoogle from "../../components/user/SignGoogle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSendOtpMutation } from "../../redux/slices/userApiSlices.js";
import { errorToast, successToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
import GoogleSignIn from "./GoogleSignIn.jsx";
const SignUp = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const formFields = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm password", 
      type: "password",
      required: true,
    },
  ];


  const extraLinks = [
    {
      text: 'already have account',
      linkText: 'sign in',
      path: '/user/login'
    }
  ]

  const { userInfo } = useSelector((state) => state.userAuth);


  const [sendOtp] = useSendOtpMutation();


  useEffect(() => {
    if (userInfo) {
      navigate('/user');
    }
  }, [userInfo, navigate])
  


  const handleSignup = async ({ name, email, password, }) => {
    setIsUpdating(true)
    try {
      const res = await sendOtp({ name, email, password }).unwrap();
      const { userId } = res;

      setIsUpdating(false);
      successToast(`OTP send to ${email}`);
      navigate(`/user/email-verification/${userId}`);
    } catch (err) {
      setIsUpdating(false);
      errorToast(err?.data?.message || err.error || err.message || 'An error occured while registering');
      console.log(err)
    }
  }


   if (isUpdating) {
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
    <div className="h-screen">
      <Form
        title="Sign up"
        fields={formFields}
        onSubmit={handleSignup}
        buttonText="Next"
        extraLinks={extraLinks}
        validationRules={signUpValidationSchema}
      />
      <div className="mt-5">
        <GoogleSignIn />
      </div>
    </div>
  );
};

export default SignUp;
