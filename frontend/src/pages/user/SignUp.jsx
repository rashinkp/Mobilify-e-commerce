import React from "react";
import Form from "../../components/user/Form";
import { signUpValidationSchema } from "../../validationSchemas";
const SignUp = () => {
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


  const handleSignup = (data) => {
    console.log('Signup data:',data)
  }

  return (
    <Form
      title="Sign up"
      fields={formFields}
      onSubmit={handleSignup}
      buttonText="Next"
      extraLinks={extraLinks}
      validationRules={signUpValidationSchema}
    />
  );
};

export default SignUp;
