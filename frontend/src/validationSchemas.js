
import * as Yup from "yup";

export const emailValidation = Yup.string()
  .email("Invalid email format")
  .required("Email is required");


export const passwordValidation = Yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters");
  


export const signUpValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});


export const loginValidationSchema = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
});

