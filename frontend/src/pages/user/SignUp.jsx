import React, { useEffect } from "react";
import Form from "../../components/Form.jsx";
import { signUpValidationSchema } from "../../validationSchemas";
import SignGoogle from "../../components/user/SignGoogle";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../components/toast/index.js";
import { registerUser } from "../../services/registerUser.js";
const SignUp = () => {
  const dispatch = useDispatch();
  const { success, loading, error } = useSelector((state) => state.userAuth)


  useEffect(() => {
    if (success) {
      successToast('Registration Successful');
    }

    if (error) {
      errorToast(error)
    }
  }, [success, error])
  

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
    dispatch(registerUser(data))
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
        <SignGoogle />
      </div>
    </div>
  );
};

export default SignUp;
