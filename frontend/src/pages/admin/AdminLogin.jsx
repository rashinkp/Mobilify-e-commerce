import React, { useEffect } from "react";
import { loginValidationSchema } from "../../validationSchemas";
import Form from "../../components/Form.jsx";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../components/toast/index.js";
import { RotatingLines } from "react-loader-spinner";
import { loginAdmin } from "../../services/auth.js";
const AdminLogin = () => {
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

const dispatch = useDispatch();
  const {success , loading , error} = useSelector((state) => state.auth);
  useEffect(() => {
    if (error) {
      errorToast(error);
    }

    if (success) {
      successToast("You have logged");
    }
  }, [error , success]);

  const handleAdminAuth = async (data) => {
    dispatch(loginAdmin(data))
  };

  const extraLinks = [
    {
      linkText: "Fogot password ?",
      path: "/admin",
    },
  ];

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
        {loading && (
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
