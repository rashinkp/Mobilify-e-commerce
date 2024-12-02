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
      acc[field.name] = "";
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
      className="max-w-lg mx-auto p-8 bg-[rgb(241,241,241)] dark:bg-[rgba(31,41,55,0.6)] shadow-md rounded-md space-y-6"
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
            rules={validationRules[field.name]}
            render={({ field: controlledField }) => (
              <input
                type={field.type}
                id={field.name}
                placeholder={field.placeholder}
                {...controlledField}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            )}
          />

          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name].message}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-primary-dark focus:ring-2 focus:ring-primary-light"
      >
        {buttonText}
      </button>
      {extraLinks.map((link, index) => (
        <p
          key={index}
          className="text-md text-gray-600 dark:text-gray-300 text-center"
        >
          {link.text}{" "}
          <Link
            to={link.path}
            className="text-blue hover:underline dark:text-blue-400"
          >
            {link.linkText}
          </Link>
        </p>
      ))}
    </form>
  );
};

export default Form;