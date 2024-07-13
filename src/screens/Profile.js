import React, { useState, useEffect } from "react";
import SuperMaster from "../layouts/SuperMaster";
import ProfileItem from "../components/ProfileItem";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../actions/Authentication";
import { useNavigate } from "react-router-dom";
import UpdatePasswordModal from "../components/UpdatePasswordModal";
import { constRoute } from "../utils/const";
import { _toggleOverylay } from "../redux/actions/settingsAction";
import { userLogout } from "../https/authentication";
import { _logout } from "../redux/actions/authentication";
import { _clearCartItems } from "../redux/actions/product";
import { _phoneNumberSet } from "../redux/actions/generalActions";

import { googleLogout } from "@react-oauth/google";

function Profile() {
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInformation = useSelector((state) => state._auth.user);
  const [signInMethod, setSignInMethod] = useState('Email');
  const [isSocialLoggedIn, setIsSocialLoggedIn] = useState(false);

  const profileLinks = [
    {
      icon: "/imgs/cart.svg",
      title: "My Orders",
      description:
        "Save the recipient from all you orders in your personal area and access them whenever you want",
      redirectTo: constRoute.myOrders,
      onClick: "",
      type: "my-orders"
    },
    {
      icon: "/imgs/user.svg",
      title: "My Personal Details",
      description:
        "Access and modify your personal details, including your name, billing address, telephone number. and more.",
      redirectTo: "/my-personal-detail",
      onClick: "",
      type: "account-details"
    },
    {
      icon: "/imgs/update_password.svg",
      title: "Update Password",
      description:
        "Enhance your account's security by updating your password regularly. This section allows you to change your password easily and keep your account secure.",
      redirectTo: "#",
      onClick: () => setIsUpdatePassword(true),
      type: "update-password",
    },
    {
      icon: "/imgs/address.svg",
      title: "My Addresses",
      description:
        "Utilize the address book feature to conveniently store multiple delivery addresses of your choice.",
      redirectTo: "/my-addresses",
      onClick: "",
      type: "my-addresses",
    },
  ];

  useEffect(() => {
    if (userInformation?.auth_type === "GOOGLE") {
      setSignInMethod('Google');
      setIsSocialLoggedIn(true);
    }
    else if (userInformation?.auth_type === "FACEBOOK") {
      setSignInMethod('Facebook')
      setIsSocialLoggedIn(true);
    }
    else if (userInformation?.auth_type === "APPPLE") {
      setSignInMethod('Apple');
      setIsSocialLoggedIn(true);
    }
    else {
      setSignInMethod('Email')
      setIsSocialLoggedIn(false);
    }
  },)
  const _userLogout = () => {
    dispatch(_logout());
    dispatch(_clearCartItems());
    dispatch(_phoneNumberSet(false));
    googleLogout();
    window.FB.logout(() => {
    });
    navigate("/");
  };

  return (
    <SuperMaster>
      <div id="profile">
        <h3 className="pb-4">My Account</h3>
        <span className="login-method">You are signed in with {signInMethod}.</span>
        {profileLinks.map((profile, index) => {

          if ((isSocialLoggedIn) && profile.type === "update-password") {
            return null;
          }
          return (
            <ProfileItem
              key={index}
              icon={profile?.icon}
              title={profile?.title}
              description={profile?.description}
              redirectTo={profile?.redirectTo}
              onClick={() => {
                if (profile.redirectTo === "#") {
                  dispatch(_toggleOverylay(true));
                  profile?.onClick();
                }
              }}
            />
          );
        })}
        <div className="_button">
          <button type="button" onClick={_userLogout}>
            LOGOUT
          </button>
        </div>
      </div>
      <UpdatePasswordModal
        isUpdatePassword={isUpdatePassword}
        setIsUpdatePassword={setIsUpdatePassword}
      />
    </SuperMaster>
  );
}
export default Profile;
