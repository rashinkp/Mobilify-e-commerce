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

// Reusable transformation function
const transformNumberField = (value, originalValue) => {
  if (typeof originalValue === "string") {
    return originalValue.trim() === "" ? null : Number(originalValue);
  }
  return originalValue;
};

// Validation schema
export const productValidation = Yup.object().shape({
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
    .transform(transformNumberField)
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

  model: Yup.string().required("Model is required"),

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
    .transform(transformNumberField)
    .nullable()
    .required("Price is required")
    .min(0, "Price cannot be negative"),

  storage: Yup.number()
    .transform(transformNumberField)
    .nullable()
    .required("Storage is required")
    .min(12, "Storage cannot be less than 12GB")
    .max(10000, "Storage cannot exceed 10TB"),

  ram: Yup.number()
    .transform(transformNumberField)
    .nullable()
    .required("RAM is required")
    .min(1, "RAM cannot be less than 1GB")
    .max(128, "RAM cannot exceed 128GB"),

  stock: Yup.number()
    .transform(transformNumberField)
    .nullable()
    .required("Stock is required")
    .min(0, "Stock cannot be negative")
    .max(10000, "Stock cannot exceed 10,000"),

  COD: Yup.string().required("COD is required"),
});

export const imageValidationSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("An image file is required")
    .test(
      "fileType",
      "Only JPG, JPEG, PNG, and SVG files are allowed",
      (value) => {
        if (!value) return false;
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/svg+xml",
          "image/webp",
        ];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File size should not exceed 5MB", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB size limit
    }),
});


export const addressValidationSchema = Yup.object().shape({
  label: Yup.string().required("Label is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string()
    .matches(/^[0-9]{5}$/, "Postal code must be 5 digits")
    .required("Postal code is required"),
  country: Yup.string().required("Country is required"),
});

export const profileValidationSchema = Yup.object().shape({
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .nullable()
    .required("Date of birth is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  name: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  bio: Yup.string().max(500, "Bio must be at most 500 characters").nullable(),
  occupation: Yup.string()
    .max(100, "Occupation must be at most 100 characters")
    .nullable(),
});


export const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup
      .string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      // .matches(/[A-Z]/, "Password must include an uppercase letter")
      // .matches(/[a-z]/, "Password must include a lowercase letter")
      // .matches(/[0-9]/, "Password must include a number")
      // .matches(
      //   /[!@#$%^&*(),.?":{}|<>]/,
      //   "Password must include a special character"
      // )
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password must be different from current password"
      ),
    confirmNewPassword: Yup
      .string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });