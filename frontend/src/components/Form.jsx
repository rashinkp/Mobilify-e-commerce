import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

const Form = ({
  title,
  fields,
  onSubmit,
  buttonText,
  extraLinks,
  validationRules,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {}),
    resolver: yupResolver(validationRules),
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-lg w-full mx-auto p-8 bg-gray-100 dark:bg-black shadow-md rounded-md space-y-6 overflow-auto max-h-[90vh]"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        {title}
      </h2>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
          </label>
          <Controller
            name={field.name}
            control={control}
            rules={{
              required: field.required && `${field.label} is required.`,
            }}
            render={({ field: controlledField }) =>
              field.type === "select" ? (
                <select
                  {...controlledField}
                  id={field.name}
                  placeholder={field.placeholder}
                  className="dark:bg-gray-600 dark:text-white px-5 py-3 rounded-lg"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  id={field.name}
                  {...controlledField}
                  className="h-4 w-4 text-skyBlue border-gray-300 rounded focus:ring-skyBlue"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  placeholder={field.placeholder}
                  {...controlledField}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-skyBlue focus:border-skyBlue bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              )
            }
          />

          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name].message}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-skyBlue text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-primary-dark focus:ring-2 focus:ring-primary-light"
      >
        {buttonText}
      </button>
      {extraLinks &&
        extraLinks.map((link, index) => (
          <p
            key={index}
            className="text-md text-gray-600 dark:text-gray-300 text-center"
          >
            {link.text}{" "}
            <Link
              to={link.path || undefined}
              onClick={link.onclick}
              className="text-skyBlue hover:underline dark:text-blue-400"
            >
              {link.linkText}
            </Link>
          </p>
        ))}
    </form>
  );
};

export default Form;
