import * as Yup from "yup";

export const emailValidation = Yup.string()
  .email("Invalid email format")
  .required("Email is required");

export const passwordValidation = Yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters");

export const signUpValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(6, "Minimum 6 character required"),
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

export const categoryNameValidationSchema = Yup.object().shape({
  category: Yup.string()
    .required("Category is required")
    .min(4, "Minimum 4 characters required"),
});

export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("OTP is required")
    .min(4, "OTP must be at least 4 characters"),
});

export const brandValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(4, "Minimum 4 characters required")
    .max(100, "Maximum 100 characters allowed"), // Added max length for name
  description: Yup.string()
    .required("Description is required")
    .min(10, "Minimum 10 characters required") // Set a reasonable minimum length
    .max(500, "Maximum 500 characters allowed"), // Limit the description length
  website: Yup.string()
    .required("Website URL is required")
    .url("Must be a valid URL"), // Validates if the string is a proper URL
});
