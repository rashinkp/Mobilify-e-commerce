import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { emailValidation } from '../validationSchemas';
import { errorToast, successToast } from './toast';
import Form from './Form';

const EnterEamil = () => {
  
  const loginFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
  ];


  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { userInfo } = useSelector((state) => state.userAuth);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate("/user");
  //   }
  // }, [userInfo, navigate]);

  // const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async ({ email, password }) => {
 
    try {
    
    } catch (err) {
   
    }

    
  };
  return (
    <>
      <div>
        <Form
          title="Enter you email"
          fields={loginFields}
          onSubmit={handleLogin}
          buttonText="Next"
          validationRules={emailValidation}
        />

        {/* {isLoading && (
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
        )} */}
      </div>
    </>
  );
}

export default EnterEamil