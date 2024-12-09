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
  .max(500, "Maximum 500 characters allowed");

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
  description: descriptionValidation,
  website: Yup.string()
    .required("Website URL is required")
    .url("Must be a valid URL"),
});

export const categoryValidation = Yup.object().shape({
  name: nameValidation,
  description: descriptionValidation,
});

export const productValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product Name is required")
    .min(4, "Product Name must be at least 4 characters")
    .max(100, "Product Name can be at most 100 characters")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Product Name can only contain letters, numbers, and spaces"
    ),

  description: Yup.string()
    .required("Product Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description can be at most 500 characters"),

  offerPercent: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .typeError("Offer Percent must be a number")
    .required("Offer Percent is required")
    .min(0, "Offer Percent cannot be negative")
    .max(100, "Offer Percent cannot exceed 100%"),

  returnPolicy: Yup.string()
    .required("Return Policy is required")
    .min(5, "Return Policy must be at least 5 characters"),

  warranty: Yup.string()
    .required("Warranty is required")
    .matches(
      /^[0-9]+( months| years)$/,
      "Warranty must be in the format of 'x months' or 'x years'"
    ),

  model: Yup.string()
    .required("Model is required"),

  size: Yup.string()
    .required("Size is required")
    .matches(
      /^[0-9.]+ (inches|cm)$/,
      "Size must be in the format of 'x inches' or 'x cm'"
    ),

  network: Yup.string()
    .required("Network is required")
    .matches(
      /^(2G|3G|4G|5G|6G)$/,
      "Network must be one of '2G', '3G', '4G','5G', or '6G'"
    ),

  price: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .required("Price is required")
    .min(0, "Price cannot be negative"),

  storage: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .required("Storage is required")
    .min(12, "Storage cannot be less than 12GB")
    .max(10000, "Storage cannot exceed 10TB"),

  ram: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .required("RAM is required")
    .min(1, "RAM cannot be less than 1GB")
    .max(128, "RAM cannot exceed 128GB"),

  stock: Yup.number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable()
    .required("Stock is required")
    .min(0, "Stock cannot be negative")
    .max(10000, "Stock cannot exceed 10,000"),
  COD: Yup.string().required('COD is required')
});
