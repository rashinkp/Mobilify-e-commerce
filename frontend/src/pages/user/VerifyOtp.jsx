import React from "react";
import Form from "../../components/Form.jsx";
import { otpValidationSchema } from "../../validationSchemas";
import { useRegisterMutation } from "../../redux/slices/userApiSlices.js";
import { errorToast, successToast } from "../../components/toast/index.js";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { userLogin } from "../../redux/slices/authUser.js";
const VerifyOtp = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = location.state || {};

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

  const handleSubmit = async (data) => {
    try {
      const res = await register({ data, id }).unwrap();
      dispatch(userLogin({ ...res }));
      successToast("User registered successfull");
      navigate("/user/");
    } catch (error) {
      errorToast(
        error?.data?.message || error.message || "Failed to register user"
      );
      console.log(error);
    }
  };
  return (
    <div className="mt-56">
      <Form
        title="Verilfy OTP"
        fields={formFields}
        onSubmit={handleSubmit}
        extraLinks={extraLinks}
        buttonText="Submit"
        validationRules={otpValidationSchema}
      />
    </div>
  );
};

export default VerifyOtp;
