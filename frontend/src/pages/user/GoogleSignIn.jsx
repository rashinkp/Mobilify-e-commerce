import React, { useEffect, useState } from 'react'
import SignGoogle from '../../components/user/SignGoogle';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useGoogleSignMutation } from '../../redux/slices/userApiSlices';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../redux/slices/authUser';
import { successToast } from '../../components/toast';
import { useNavigate } from 'react-router';

const GoogleSignIn = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleSign] = useGoogleSignMutation();


  const loginBtn = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });


  useEffect(() => {
    if (user && user.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          const { name, email, picture } = res.data;
          const response = await googleSign({ name, email, picture }).unwrap();
          const user = response.data;
          dispatch(userLogin({ ...user }));
          successToast("Login Successful");
          navigate("/user");
        })
        .catch((err) => console.log(err));
    }
  }, [user, googleSign, dispatch]);

  return (
    <div onClick={loginBtn}>
      <SignGoogle  />
    </div>
  );
};


export default GoogleSignIn