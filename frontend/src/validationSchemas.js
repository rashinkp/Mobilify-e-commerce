import * as Yup from "yup";

export const emailValidation = Yup.string()
  .email("Invalid email format")
  .required("Email is required");

export const passwordValidation = Yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters");

export const nameValidation = Yup.string()
  .required("Name is required")
  .min(4, "Minimum 4 characters required")
  .max(100, "Maximum 100 characters allowed");

export const descriptionValidation = Yup.string()
    .required("Description is required")
    .min(10, "Minimum 10 characters required") 
    .max(500, "Maximum 500 characters allowed")

export const signUpValidationSchema = Yup.object().shape({
  name: nameValidation,
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



export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("OTP is required")
    .min(4, "OTP must be at least 4 characters"),
});

export const brandValidationSchema = Yup.object().shape({
  name: nameValidation,
  description:descriptionValidation, 
  website: Yup.string()
    .required("Website URL is required")
    .url("Must be a valid URL"), 
});

export const categoryValidation = Yup.object().shape({
  name: nameValidation,
  description: descriptionValidation,
});
