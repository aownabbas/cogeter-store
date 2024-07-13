import axios from "axios";
import React, { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { _appleLogin } from "../../redux/actions/authentication";
import { useDispatch } from "react-redux";
import { onAppleLogin } from "../../https/authentication";

const AppleAuthentication = () => {
  const [appleToken, setAppleToken] = useState()
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    setAppleToken(code)


    if (code && state) {
      // Handle the authorization code, e.g. send it to the server
      const data = fetchAppleToken(code);
      if (data.id_token) {
        const decodedToken = jwtDecode(data.id_token);
      } else {
      }
    }
  }, []);


  async function fetchAppleToken(authorizationCode) {
    // const url = 'https://appleid.apple.com/auth/token';
    // const clientId = 'com.cogeter.store.appleLogin'; // Your client ID
    // const redirectUri = 'https://store-dev.cogeter.com/apple-login'; // Your redirect URI
    // const clientSecret = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4NVc4UlVQNksifQ.eyJpc3MiOiIyOUM5WEc1Nk04IiwiaWF0IjoxNjk3NzIzMDEyLCJleHAiOjE3MTMyNzUwMTIsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20uY29nZXRlci5zdG9yZS5hcHBsZUxvZ2luIn0.9nAZhg5IxLYCqw7QyYWVVMondWsfKNBmx3UQLBEG7ybnOOazTAJEMCLpGYuSDdtxjDvW7PJ69piqUXsZQEB4rA";

    // const response = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: `grant_type=authorization_code&code=${authorizationCode}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`
    // });


    // if (!response.ok) {
    //   throw new Error('Network response was not ok ' + response.statusText);
    // }
    const payload = {
      token: appleToken
    }
    try {
      const response = await onAppleLogin(payload);
      if (response.status === 200) {
        dispatch(_appleLogin(response.data))
      }
    } catch (error) {
    }

    // return await response.json();
  }
  // const authenticateAppleResponse = async (authorizationCode) => {
  //   // Your client ID and secret obtained from Apple's developer portal
  //   const clientId = "com.cogeter.store.appleLogin";
  //   const clientSecret = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4NVc4UlVQNksifQ.eyJpc3MiOiIyOUM5WEc1Nk04IiwiaWF0IjoxNjk3NzIzMDEyLCJleHAiOjE3MTMyNzUwMTIsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20uY29nZXRlci5zdG9yZS5hcHBsZUxvZ2luIn0.9nAZhg5IxLYCqw7QyYWVVMondWsfKNBmx3UQLBEG7ybnOOazTAJEMCLpGYuSDdtxjDvW7PJ69piqUXsZQEB4rA";

  //   // The URL to exchange the code for tokens
  //   const tokenExchangeURL =
  //     "https://com.cogeter.store.appleLogin.apple.com/auth/token";

  //   // Prepare the data to exchange the code for tokens
  //   const tokenExchangeData = {
  //     client_id: clientId,
  //     client_secret: clientSecret,
  //     code: authorizationCode,
  //     grant_type: "authorization_code",
  //   };
  //   axios
  //     .post(tokenExchangeURL, tokenExchangeData)
  //     .then((response) => {
  //       // Handle the response here
  //       const accessToken = response.data.access_token;
  //       const refreshToken = response.data.refresh_token;
  //       // Store these tokens securely and use them for authentication
  //     })
  //     .catch((error) => {
  //       console.error("Token exchange failed:", error);
  //     });
  // };

  return <div>AppleAuthentication</div>;
};

export default AppleAuthentication;
