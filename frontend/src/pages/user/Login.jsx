import React from "react";
import Form from "../../components/Form.jsx";
import { loginValidationSchema } from "../../validationSchemas";
import SignGoogle from "../../components/user/SignGoogle";
import { useDispatch, useSelector} from "react-redux"
import { adminLogin } from "../../redux/actions/auth.js";
const Login = () => {
  const loginFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  const extraLinks = [
    {
      text: `don't have account?`,
      linkText: `signup`,
      path: "/user/signup",
    },
    {
      linkText: `forgot password?`,
      path: "/user/forgotpassword",
    },
  ];


  const handleLogin = (data) => {
  
  };

  return ( 
    <div className="pt-18 px-5">
      <Form
        title="Login"
        fields={loginFields}
        onSubmit={handleLogin}
        buttonText="Login"
        extraLinks={extraLinks}
        validationRules={loginValidationSchema}
      />
      <div className="mt-5">
        <SignGoogle />
      </div>
    </div>
  );
};

export default Login;
