import React, { useEffect } from "react";
import Form from "../../components/Form.jsx";
import { loginValidationSchema } from "../../validationSchemas";
import SignGoogle from "../../components/user/SignGoogle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../../redux/slices/userApiSlices.js";
import { userLogin } from "../../redux/slices/authUser.js";
import { errorToast, successToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
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


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (userInfo) {
      navigate('/user');
    }
  }, [userInfo, navigate]);

  const [login , {isLoading}] = useLoginMutation();


  const handleLogin = async({email , password}) => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(userLogin({...res}));
      successToast('Login Successful');
      navigate('/user');
    } catch (err) {
      errorToast(
        err?.data?.message ||
          err.error ||
          err.message ||
          "An error occured while registering"
      );
    }
  };

  return (
    <div>
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
  );
};

export default Login;
