import React from 'react'
import { loginValidationSchema } from '../../validationSchemas';
import Form from '../../components/Form.jsx'
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

  const handleAdminAuth = () => {
    console.log('Admin log auth recieved');
  }

  const extraLinks = [
    {
      linkText: 'Fogot password ?',
      path:'/admin'
    }
  ]
  return (
    <div className='pt-44'>
      <Form title='Admin Login' fields={formField} extraLinks={extraLinks} onSubmit={handleAdminAuth} buttonText='Login' validationRules={loginValidationSchema} />
    </div>
  )
}

export default AdminLogin