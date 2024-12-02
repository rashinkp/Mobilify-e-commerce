import React from 'react'
import Form from '../../components/user/Form'
import { otpValidationSchema } from '../../validationSchemas';
const VerifyOtp = () => {
  const formFields = [
    {
      name: "otp",
      label: "OTP",
      placeholder: "Enter One Time Password",
      type: "text",
      required: true,
    },
  ];

  const extraLinks = [
    {
      text: "in 0:58",
      linkText: "resend otp",
      path: "/user",
    },
  ];

  const handleSubmit = (data) => {
    console.log('Otp : ', data)
  } 
  return (
    <Form
      title="Verilfy OTP"
      fields={formFields}
      onSubmit={handleSubmit}
      extraLinks={extraLinks}
      buttonText='Submit'
      validationRules={otpValidationSchema}
    />
  );
}

export default VerifyOtp