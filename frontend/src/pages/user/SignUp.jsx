import React, { useEffect } from "react";
import Form from "../../components/Form.jsx";
import { signUpValidationSchema } from "../../validationSchemas";
import SignGoogle from "../../components/user/SignGoogle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../../redux/slices/userApiSlices.js";
import { userLogin} from '../../redux/slices/authUser.js'
import { errorToast, successToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

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

  const [register, { isLoading }] = useRegisterMutation();


  useEffect(() => {
    if (userInfo) {
      navigate('/user');
    }
  },[userInfo,navigate])


  const handleSignup = async({name,email,password,}) => {
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(userLogin({ ...res }));
      successToast('Registration Successful');
      navigate('/user');
    } catch (err) {
      errorToast(err?.data?.message || err.error || err.message || 'An error occured while registering');
    }
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

export default SignUp;
