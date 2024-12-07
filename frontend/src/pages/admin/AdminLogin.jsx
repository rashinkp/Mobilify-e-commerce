import React, { useEffect } from "react";
import { loginValidationSchema } from "../../validationSchemas";
import Form from "../../components/Form.jsx";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router";
import { useAdminLoginMutation } from "../../redux/slices/AdminApiSlices.js";
import { adminLogin } from "../../redux/slices/authAdmin.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //props for form
  const formField = [
    {
      name: "email",
      lable: "Enter your email",
      placeholder: "Enter your email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      lable: "Enter your password",
      placeholder: "Enter your password",
      type: "password",
      required: true,
    },
  ];

  const extraLinks = [
    {
      linkText: "Forgot password?",
      path: "/admin/forgot-password",
    },
  ];

  

  
  //api handling

  const [login, { isLoading }] = useAdminLoginMutation();

  const { adminInfo } = useSelector((state) => state.adminAuth)


  useEffect(() => {
    if (adminInfo) {
      navigate('/admin');
    }
  }, [navigate, adminInfo])
  
    const handleAdminAuth = async ({email , password}) => {
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(adminLogin({ ...res }));
        successToast('Login Successfull');
        navigate('/admin')
      } catch (err) {
        errorToast(err?.data?.message || err.message || err.error);
      }
    };

  return (
    <>
      <div className="flex h-screen w-full items-center">
        <Form
          title="Admin Login"
          fields={formField}
          extraLinks={extraLinks}
          onSubmit={handleAdminAuth}
          buttonText="Login"
          validationRules={loginValidationSchema}
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

export default AdminLogin;
