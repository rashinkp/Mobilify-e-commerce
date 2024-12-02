import React from 'react'
import Form from '../../components/user/Form'
import { loginValidationSchema } from '../../validationSchemas';

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
    console.log('Login Data:', data)
  }
  return (
    <div className='pt-24 px-5'>
      <Form
        title="Login"
        fields={loginFields}
        onSubmit={handleLogin}
        buttonText="Login"
        extraLinks={extraLinks}
        validationRules={loginValidationSchema}
      />
    </div>
  );
}

export default Login