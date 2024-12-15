import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  emailForm,
  emailValidation,
  otpValidationSchema,
} from "../validationSchemas";
import { errorToast, successToast } from "./toast";
import Form from "./Form";
import { useOtpVerifcationMutation } from "../redux/slices/userApiSlices";
import { RotatingLines } from "react-loader-spinner";

const EnterOtp = () => {
  const [verifyOtp] = useOtpVerifcationMutation();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();



    useEffect(() => {
      if (timeLeft <= 0) return;
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, [timeLeft]);
  
  

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    };
  

  const handleSubmit = async (otp) => {
      setIsLoading(true)
      try {
        await verifyOtp(otp).unwrap();
        successToast("otp verified");
        navigate("/user/forgotPassword");
      } catch (error) {
        console.error("Error changing password:", error);
        errorToast(error?.message || error?.data?.message || "Error occurred");
      } finally {
        setIsLoading(false);
      }
    };

  const handleResend = async () => {
      setIsLoading(true);
      try {
        const result = await resendOtp({ id });
        successToast("OTP resent successfully");
        setTimeLeft(295);
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend OTP";
        errorToast(errorMessage);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };




  const loginFields = [
    {
      name: "otp",
      label: "OTP",
      type: "number",
      placeholder: "Enter your otp",
      required: true,
    },
  ];

  

    const extraLinks = [
      {
        linkText: `Change email?`,
        path: "/user/forgotPassword/email",
      },
      {
        text: `${
          timeLeft === 0 ? "" : "Resend OTP in " + formatTime(timeLeft)
        }`,
        linkText: `${
          timeLeft === 0 ? "Resend OTP" : ""
        }`,
        onclick: handleResend,
      },
    ];



  

  return (
    <>
      <div className="h-[70vh] flex items-center">
        <Form
          title="Enter you OTP"
          fields={loginFields}
          onSubmit={handleSubmit}
          buttonText="Next"
          validationRules={otpValidationSchema}
          extraLinks={extraLinks}
        />

        {isLoading && (
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
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EnterOtp;
