import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { _getAllCartItems } from '../../redux/actions/product';
import { listAllCartItems } from '../../https/cartRequests';
import {
  cartItemsSummary,
  errorRequestHandel,
  formatDecimal,
  getCurrencyMultiplier,
  isValidEmailAddress,
} from '../../utils/helperFile';
import useWindowSize from '../../utils/hooks/useWindowSize';
import { addNewAddress, getAddressesList, updateAddress } from '../../https/addressesRequests';
import { _setCountry, _toggleLoginModal, _toggleOverylay } from '../../redux/actions/settingsAction';
import PhoneNumberInput from '../resuable/phone-input/PhoneNumberInput';

import downArrow from '../../assets/checkout/arrow-square-down.svg';
import smalDownArrow from '../../assets/checkout/arrow-down.svg';
import PromoCode from '../PromoCode';
import { SOCIAL_LOGINS } from '../../utils/const';

import FacebookLogin from 'react-facebook-login';
import facebookIcon from '../../assets/social-logins/facebook-icon.svg';
import gogoleIcon from '../../assets/social-logins/gogole-icon.svg';
import appleIcon from '../../assets/social-logins/apple-icon.svg';
import SocialButton from '../resuable/social-buttons/SocialButton';
import CartLinksOptions from './CartLinksOptions';
import { loginWithSocialAccount, userRegister } from '../../https/authentication';
import { _login, _register } from '../../redux/actions/authentication';
import { toast } from 'react-toastify';
import { _updateAddress } from '../../redux/actions/addresses';
import { useGoogleLogin } from '@react-oauth/google';

import axios from "axios";
import CustomProfileModal from "../custom-profile-modal/CustomProfileModal";
import LoginModal from "../LoginModal";
import { trackAddShippingInfo } from "../../utils/analyticsEvents";

const CartInformation = ({ cartItems, hide, onContinueShipping, setUserAddress, setManuallyAddAddress }) => {
  let userToken = localStorage.getItem('token');
  const isLoggedIn = useSelector((state) => state._auth.isAuthenticated);
  const [loginModal, setLoginModal] = useState(false);

  const { width } = useWindowSize();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const firstNameRef = useRef(null);
  // const lastNameRef = useRef(null);

  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    phoneNumber: useRef(null),
    password: useRef(null),
    city: useRef(null),
    state: useRef(null),
    addressLine1: useRef(null),
  };

  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpandDropdown, setIsExpandDropwn] = useState(false);
  const [cashPayment, setCashPayment] = useState(false);
  const [standardShipping, setStandardShipping] = useState(true);
  const [sameDayShipping, setSameDayShipping] = useState(false);
  const _selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const [selectedCountry, setSelectedCountry] = useState(_selectedCountry ?? '');

  const _countryLists = useSelector((state) => state._general.countryList);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isAllFields, setisAllFields] = useState(false);
  const [isFromPayment, setisFromPayment] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(_selectedCountry ? _selectedCountry?.id : '');

  // Use the cartItemsSummary function to calculate subtotal and total amount

  const [values, setValues] = useState({
    address: {},
    user: {},
  });

  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const countryDeliveryTaxes = useSelector((state) => state._general.countryDeliveryTaxes);
  const [selectedCountryDeliveryTaxes, setSelectedCountryDeliveryTaxes] = useState(null);

  const [discountedAmount, setDiscountedAmount] = useState({
    value: 0,
    type: 'Percentage',
  });
  const [rateMultiplier, setRateMultiplier] = useState(1);
  useEffect(() => {
    setRateMultiplier(getCurrencyMultiplier(exchangeRates, _selectedCountry?.currency));
  }, [_selectedCountry, selectedCountry, exchangeRates]);

  const _countryDeliveryTaxes = countryDeliveryTaxes?.find((item) => item.country.id === _selectedCountry?.id);

  useEffect(() => {
    setTimeout(() => {
      setisFromPayment(true);
    }, 1000);
  }, []);
  useEffect(() => {
    setSelectedCountryDeliveryTaxes(_countryDeliveryTaxes);
  }, [_selectedCountry, selectedCountry, countryDeliveryTaxes]);

  useEffect(() => {
    fetchAddressesList();
  }, []);

  useEffect(() => {
    userToken = localStorage.getItem('token');
    if (userToken) {
      fetchAddressesList();
    }
  }, [loginModal]);

  useEffect(() => {
    getCartItemsFromServer();
  }, []);
  const getCartItemsFromServer = async () => {
    try {
      const response = await listAllCartItems(userToken);
      if (response.status === 200) {
        dispatch(_getAllCartItems(response.data.data));
      }
    } catch (error) { }
  };

  const fetchAddressesList = async () => {
    userToken = localStorage.getItem('token');
    if (!userToken) {
      return;
    }
    try {
      setLoading(true);
      const response = await getAddressesList({ limit: 1000, page: 1 });
      if (response.status === 200) {
        setAddresses(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleDropdown = () => {
    setIsExpandDropwn(!isExpandDropdown);
  };

  const { subTotal, totalAmount, discountAmount, standardDeliveryCharges, sameDayDeliveryCharges, codFee } =
    cartItemsSummary(false, false, discountedAmount, cartItems, selectedCountryDeliveryTaxes, rateMultiplier);

  const handleCountryChange = (e) => {
    const findSelectedCountry = _countryLists.find((country) => country.id === parseInt(e.target.value));
    dispatch(_setCountry(findSelectedCountry));
    setSelectedCountry(e.target.value);
    setStandardShipping(true);
    setSameDayShipping(false);
    setSelectedCountryId(e.target.value);
  };

  const onApplyCoupon = (value, promoCodeVal) => {
    setDiscountedAmount(value);
    setPromoCode(promoCodeVal);
  };

  //   useEffect(() => {
  //     setCardPayment(true);
  //     setisTabbySelect(false);
  //     setisTammaraSelect(false);
  //   }, [_selectedCountry]);

  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    addressLine1: '',
    addressLine2: '',
  });

  const product_detail = useSelector((state) => state.products.product_detail);


  const handelContinueShipping = async () => {
    let userObject = {};
    const isEmailValid = isValidEmailAddress(values.user?.email?.trim());
    try {
      setisLoading(true);
      if (userToken === '' || userToken === null || userToken == undefined) {
        if (
          (values.user?.firstName === '' || values.user?.firstName === undefined) &&
          (values.user?.lastName === '' || values.user?.lastName === undefined) &&
          (values.user.email === '' || values.user?.email === undefined) &&
          (values.user?.phoneNumber === '' || values.user?.phoneNumber === undefined) &&
          (values.user.password === '' || values.user?.password === undefined) &&
          (values.address.city === '' || values.address?.city === undefined) &&
          (values.address.state === '' || values.address?.state === undefined) &&
          (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined)
        ) {
          setErrors({
            first_name: 'This field is required',
            last_name: 'This field is required',
            email: 'This field is required',
            phone: 'This field is required',
            password: 'This field is required',
            city: 'This field is required',
            state: 'This field is required',
            addressLine1: 'This field is required',
          });
          inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.user?.firstName === '' || values.user?.firstName === undefined) {
          setErrors({
            ...errors,
            first_name: 'This field is required',
          });
          inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.user?.lastName === '' || values.user?.lastName === undefined) {
          setErrors({
            ...errors,
            last_name: 'This field is required',
          });
          inputRefs.lastName.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.user?.email === '' || values.user?.email === undefined) {
          setErrors({
            ...errors,
            email: 'This field is required',
          });
          inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (!isEmailValid) {
          setErrors({
            ...errors,
            email: 'Enter a valid email address',
          });
          inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        // if (
        //   values.user?.phoneNumber === "" ||
        //   values.user?.phoneNumber === undefined
        // ) {
        //   setErrors({
        //     ...errors,
        //     phone: "This field is required",
        //   });
        //   inputRefs.phoneNumber.current.scrollIntoView({ behavior: "smooth" });
        //   setisLoading(false);
        //   return;
        // }
        if (values.user?.phoneNumber === '' || values.user?.phoneNumber === undefined) {
          setErrors({
            ...errors,
            phone: 'This field is required',
          });
          inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (errors.phone !== '') {
          inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.user.password === '' || values.user?.password === undefined) {
          setErrors({
            ...errors,
            password: 'This field is required',
          });
          inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.user.password.length < 6) {
          setErrors({
            ...errors,
            password: 'password must be at least 6 characters',
          });
          inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.address.city === '' || values.address?.city === undefined) {
          setErrors({
            ...errors,
            city: 'This field is required',
          });
          inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.address.state === '' || values.address?.state === undefined) {
          setErrors({
            ...errors,
            state: 'This field is required',
          });
          inputRefs.state.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        if (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined) {
          setErrors({
            ...errors,
            addressLine1: 'This field is required',
          });
          inputRefs.addressLine1.current.scrollIntoView({ behavior: 'smooth' });
          setisLoading(false);
          return;
        }
        // else if (Object.keys(values?.address).length === 0) {
        //   toast.warning('Add your address');
        //   toast.warning('Enter address line 2');
        //   setisLoading(false);
        //   return;
        // }
        userObject = {
          first_name: values.user?.firstName,
          last_name: values.user?.lastName,
          email: values.user?.email?.trim(),
          phone: values.user?.phoneNumber,
          phone_code: values.user?.phoneCode,
          password: values.user?.password,
          username: values.user?.email?.trim(),
        };

        const response = await userRegister(userObject);
        if (response.status === 200) {
          dispatch(_register(response.data.data));
          await addAddress();
          trackAddShippingInfo(_selectedCountry?.currency, product_detail, rateMultiplier)
        }
      } else if (addressId) {
        const selectedAddress = getAddressById(addressId); // Replace this with your logic to get the selected address
        setUserAddress(selectedAddress);

        if (areAddressFieldsEqual(selectedAddress, values.address)) {
          // await updateAddress(addressId, values.address); // Replace with your update address API call
          onContinueShipping(addressId);
          trackAddShippingInfo(_selectedCountry?.currency, product_detail, rateMultiplier)
        } else {
          await handelUpdateAddress(addressId);
        }
        // onContinueShipping(addressId);
      } else {
        await addAddress();
      }
    } catch (error) {
      setisLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const getAddressById = (addressId) => {
    // Replace this with your actual logic to retrieve an address by ID
    const address = addresses.find((addr) => addr.id === addressId);
    return address;
  };
  const areAddressFieldsEqual = (address1, address2) => {
    // Compare individual address fields here
    return (
      address1.address_line_1 === address2.address_line_1 &&
      address1.address_line_2 === address2.address_line_2 &&
      address1.city === address2.city &&
      address1.phone === address2.phone &&
      address1.state === address2.state &&
      address1?.country?.id === _selectedCountry?.id
    );
  };

  const addAddress = async () => {
    if (
      (values.address.city === '' || values.address?.city === undefined) &&
      (values.address.state === '' || values.address?.state === undefined) &&
      (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined)
    ) {
      setErrors({
        city: 'This field is required',
        state: 'This field is required',
        addressLine1: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.city === '' || values.address?.city === undefined) {
      setErrors({
        ...errors,
        city: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.state === '' || values.address?.state === undefined) {
      setErrors({
        ...errors,
        state: 'This field is required',
      });
      inputRefs.state.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined) {
      setErrors({
        ...errors,
        addressLine1: 'This field is required',
      });
      inputRefs.addressLine1.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    try {
      const data = {
        latitude: '0',
        longitude: '0',
        address_line_1: values?.address?.address_line_1,
        address_line_2: values?.address?.address_line_2,
        city: values?.address?.city,
        country: _selectedCountry?.id,
        state: values?.address?.state,
        phone: values?.address?.phone,
      };
      setManuallyAddAddress(data);
      const response = await addNewAddress({ data: data });
      if (response.status === 200) {
        await fetchAddressesList();
        onContinueShipping(response.data?.data?.id);
        setisLoading(false);
        trackAddShippingInfo(_selectedCountry?.currency, product_detail, rateMultiplier)
      }
    } catch (error) {
      setisLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const handelUpdateAddress = async (addId) => {
    if (
      (values.address.city === '' || values.address?.city === undefined) &&
      (values.address.state === '' || values.address?.state === undefined) &&
      (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined)
    ) {
      setErrors({
        city: 'This field is required',
        state: 'This field is required',
        addressLine1: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.city === '' || values.address?.city === undefined) {
      setErrors({
        ...errors,
        city: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.state === '' || values.address?.state === undefined) {
      setErrors({
        ...errors,
        state: 'This field is required',
      });
      inputRefs.state.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }
    if (values.address.address_line_1 === '' || values.address?.address_line_1 === undefined) {
      setErrors({
        ...errors,
        addressLine1: 'This field is required',
      });
      inputRefs.addressLine1.current.scrollIntoView({ behavior: 'smooth' });
      setisLoading(false);
      return;
    }

    try {
      const data = {
        latitude: '0',
        longitude: '0',
        address_line_1: values?.address?.address_line_1,
        address_line_2: values?.address?.address_line_2,
        city: values?.address?.city,
        country: _selectedCountry?.id,
        state: values?.address?.state,
        phone: values?.address?.phone,
      };

      const response = await updateAddress({
        data: data,
        id: addId,
      });
      if (response.status === 200) {
        await fetchAddressesList();
        setisLoading(false);
        onContinueShipping(addId);
        trackAddShippingInfo(_selectedCountry?.currency, product_detail, rateMultiplier)
      }
    } catch (error) {
      setisLoading(false);

      errorRequestHandel({ error: error });
    }
  };

  // social logins
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => getUserGoogleProfile(tokenResponse?.access_token),
  });

  const getUserGoogleProfile = async (access_token) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { name, email } = response.data;
      let firstName = '';
      let lastName = '';

      if (name) {
        const [firstWord, ...restWords] = name.split(' ');
        firstName = firstWord;
        lastName = restWords.join(' ');
      }
      const payload = {
        email: email,
        username: email,
        first_name: firstName,
        last_name: lastName,
        phone: '',
        phone_code: '',
        auth_type: 'GOOGLE',
      };

      await loginUserWidthSocialAccounts(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const loginUserWidthSocialAccounts = async (payload) => {
    try {
      const response = await loginWithSocialAccount(payload);
      if (response.status === 200) {
        dispatch(_login(response.data.data));
        await fetchAddressesList();
      }
    } catch (error) {
      errorRequestHandel({ error: error });
    }
  };

  const responseFacebook = async (response) => {
    try {
      if (response) {
        let firstName = '';
        let lastName = '';

        if (response.name) {
          const [firstWord, ...restWords] = response?.name.split(' ');
          firstName = firstWord;
          lastName = restWords.join(' ');
        }
        const payload = {
          email: response?.email ?? response?.userID,
          username: response.email ?? response?.userID,
          first_name: firstName,
          last_name: lastName,
          phone: '',
          phone_code: '',
          auth_type: 'FACEBOOK',
        };
        await loginUserWidthSocialAccounts(payload);
      }
    } catch (error) { }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`_paymentContent ${hide}`}>
      <div className="container">
        <div className="row gx-5 ">
          <div className="col-md-6 mb-4 mb-md-0 ">
            {/* Left side: Form input fields */}
            <br />
            {userToken === null || userToken === '' ? (
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-md-0 ">
                  <FacebookLogin
                    appId={SOCIAL_LOGINS.FACEBOOK_CLIENT_ID}
                    autoLoad={false}
                    fields="name,email"
                    onClick={() => { }} // Prevent the default click action (no-op)
                    callback={responseFacebook}
                    redirectUri={process.env.REACT_APP_WEBSITE_URL}
                    cssClass="social_button__facebook_container"
                    textButton="Continue with Facebook"
                    scope="public_profile, email"
                    buttonStyle={{
                      fontSize: 11,
                      color: '#000000',
                      fontWeight: '500',
                      textAlign: 'left',
                    }}
                    icon={
                      <div className="social_button__icon">
                        <img
                          src={facebookIcon}
                          style={{
                            width: 22,
                            objectFit: 'contain',
                            marginRight: '16px',
                            marginLeft: 2,
                          }}
                        />
                      </div>
                    }
                    containerStyle={{
                      width: '100%',
                      border: '1px solid #7089FB',
                      height: 45,
                      display: 'flex',
                      backgroundColor: 'transparent',
                      // marginTop: 10,
                      boxShadow: 'none',
                      alignItems: 'center',
                      marginTop: 10,
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-4 mb-4 mb-md-0 ">
                  <SocialButton
                    title={'Continue with Google'}
                    icon={gogoleIcon}
                    fontSize={11}
                    onClick={() => googleLogin()}
                  />
                </div>
                {/* <div className="col-lg-4 col-md-6 mb-4 mb-md-0 ">
                  <SocialButton
                    title={"Continue with Apple"}
                    icon={appleIcon}
                    fontSize={11}

                  // onClick={logout}
                  />
                </div> */}
                <br />
                {/* or create account */}
                {/* <b >OR</b> */}
                <div className="or-line-container">
                  <div className="line"></div>
                  <span className="or">OR</span>
                  <div className="line"></div>
                </div>
              </div>
            ) : null}
            <div className="d-flex justify-content-between align-items-center">
              {!isLoggedIn ? (
                <>
                  <div className="col-md-10">
                    <p className="checkout__create__Account">Create Cogeter Account</p>
                  </div>
                  <div className="col-md-2 text-right">
                    <span
                      className="checkout__signin"
                      onClick={() => {
                        dispatch(_toggleOverylay(true));
                        dispatch(_toggleLoginModal(true));
                      }}
                    >
                      Sign In
                    </span>
                  </div>
                </>
              ) : (
                <p className="checkout__create__Account">Select an Address</p>
              )}
            </div>
            <form>
              {!isLoggedIn ? (
                <>
                  <div className="form-group row">
                    <div className="col-md-6" ref={inputRefs.firstName}>
                      <div className="floating-label">
                        <input
                          type="text"
                          className={`form-control ${errors.first_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                          id="firstName"
                          required
                          placeholder="First Name"
                          value={values?.user?.firstName ?? ''}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                firstName: e.target.value,
                              },
                            })
                          }
                          onFocus={() => setErrors({ ...errors, first_name: '' })}
                        />
                      </div>
                      <div className="text-danger">
                        <span>{errors.first_name}</span>
                      </div>
                    </div>

                    <div className="col-md-6" ref={inputRefs.lastName}>
                      <div className="floating-label">
                        <input
                          type="text"
                          className={`form-control ${errors.last_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                          id="lastName"
                          required
                          placeholder="Last Name"
                          value={values?.user?.lastName ?? ''}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                lastName: e.target.value,
                              },
                            })
                          }
                          onFocus={() => setErrors({ ...errors, last_name: '' })}
                        />
                      </div>
                      <div className="text-danger">
                        <span>{errors.last_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6" ref={inputRefs.email}>
                      <div className="floating-label">
                        <input
                          type="text"
                          className={`form-control ${errors.email !== '' ? 'custom-input-error' : 'custom-input'}`}
                          id="emailAddress"
                          required
                          placeholder="Email Address"
                          value={values?.user?.email ?? ''}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                email: e.target.value.replace(/\s/g, ''),
                              },
                            })
                          }
                          onFocus={() => setErrors({ ...errors, email: '' })}
                        />
                      </div>
                      <div className="text-danger">
                        <span>{errors.email}</span>
                      </div>
                    </div>
                    <div className="col-md-6" ref={inputRefs.phoneNumber}>
                      <div onFocus={() => setErrors({ ...errors, phone: '' })}>
                        <PhoneNumberInput
                          isFromPayment={isFromPayment}
                          onChange={(phone) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                phoneNumber: phone,
                              },
                            })
                          }
                          onPhoneCode={(code) => {
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                phoneCode: code,
                              },
                            });
                          }}
                          setErrors={setErrors}
                          errors={errors}
                        />
                      </div>
                      {/* <div className="text-danger">
                        <span>{errors.phone}</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12" ref={inputRefs.password}>
                      <div className="floating-label input-container">
                        <span className="input-icon">
                          {showPassword == false ? (
                            <img
                              className="_cursor_pointer"
                              onClick={() => handleTogglePassword()}
                              src="/imgs/icons/hidePassword.png"
                              alt="Icon"
                              width={15}
                              height={15}
                            />
                          ) : (
                            <img
                              className="_cursor_pointer"
                              onClick={() => handleTogglePassword()}
                              src="/imgs/icons/eyeIcon.png"
                              alt="Icon"
                              width={15}
                              height={15}
                            />
                          )}
                        </span>
                        <input
                          type={showPassword == true ? 'text' : 'Password'}
                          className={`form-control ${errors.password !== '' ? 'custom-input-error' : 'custom-input'}`}
                          id="Password"
                          required
                          placeholder="Password"
                          value={values?.user?.password ?? ''}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                password: e.target.value,
                              },
                            })
                          }
                          onFocus={() => setErrors({ ...errors, password: '' })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-danger">
                    <span>{errors.password}</span>
                  </div>
                </>
              ) : (
                <div>
                  <div className={`card_expand ${isExpandDropdown ? 'expanded' : ''}`}>
                    <div className="card-header_dropdown" onClick={toggleDropdown}>
                      {addresses?.length == 0 ? (
                        <span>Add new address</span>
                      ) : (
                        <span>{values?.address?.address_line_1 ?? 'Select'}</span>
                      )}

                      <img
                        src={smalDownArrow}
                        alt="Expand/Collapse Icon"
                        className={`arrow-icon ${isExpandDropdown ? 'expanded' : ''}`}
                      />
                    </div>
                    {isExpandDropdown && (
                      <div className="card-body">
                        <div className="card__expand_dropwn_body">
                          {addresses.map((item, index) => {
                            return (
                              <>
                                {index === 0 ? (
                                  <>
                                    <span
                                      key={100}
                                      className="card__expand_addnew_address"
                                      onClick={() => {
                                        setValues({ ...values, address: {} });
                                        //setSelectedCountryId("");
                                        setIsExpandDropwn(false);
                                      }}
                                    >
                                      Add new address
                                    </span>
                                  </>
                                ) : null}
                                <div
                                  key={index}
                                  className="addres_dropdown_items"
                                  onClick={() => {
                                    setValues({ ...values, address: item });
                                    setAddressId(item.id);
                                    setIsExpandDropwn(false);
                                    setSelectedCountryId(item.country?.id);
                                    setSelectedCountry(item?.country?.name);
                                    const findSelectedCountry = _countryLists.find(
                                      (country) => country.id === parseInt(item.country?.id),
                                    );
                                    dispatch(_setCountry(findSelectedCountry));
                                  }}
                                >
                                  <span className="addres_dropdown_item">{item.address_line_1}</span>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Add more input fields as needed */}

              <br />
              <h4>Add Address</h4>
              <div className="form-group row">
                <div className="col-md-12">
                  <div className="form-group">
                    <select
                      className="form-control custom-select"
                      id="country"
                      placeholder="Country"
                      required
                      value={_selectedCountry?.id || selectedCountryId}
                      onChange={handleCountryChange}
                    >
                      <option value="" disabled>
                        Select a country
                      </option>
                      {_countryLists?.map((item, index) => {
                        return (
                          <option value={item.id} key={index}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-6" ref={inputRefs.city}>
                  <div className="floating-label">
                    <input
                      type="text"
                      className={`form-control ${errors.city !== '' ? 'custom-input-error' : 'custom-input'}`}
                      id="City"
                      required
                      placeholder="City"
                      value={values?.address?.city ?? ''}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            city: e.target.value,
                          },
                        })
                      }
                      onFocus={() => setErrors({ ...errors, city: '' })}
                    />
                  </div>
                  <div className="text-danger">
                    <span>{errors.city}</span>
                  </div>
                </div>
                <div className="col-md-6" ref={inputRefs.state}>
                  <div className="floating-label">
                    <input
                      type="text"
                      className={`form-control ${errors.state !== '' ? 'custom-input-error' : 'custom-input'}`}
                      id="lastName"
                      required
                      placeholder="State"
                      value={values?.address?.state ?? ''}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            state: e.target.value,
                          },
                        })
                      }
                      onFocus={() => setErrors({ ...errors, state: '' })}
                    />
                  </div>
                  <div className="text-danger">
                    <span>{errors.state}</span>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12" ref={inputRefs.addressLine1}>
                  <div className="floating-label">
                    <input
                      type="text"
                      className={`form-control ${errors.addressLine1 !== '' ? 'custom-input-error' : 'custom-input'}`}
                      id="addressline"
                      required
                      placeholder="Address line 1"
                      value={values?.address?.address_line_1 ?? ''}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            address_line_1: e.target.value,
                          },
                        })
                      }
                      onFocus={() => setErrors({ ...errors, addressLine1: '' })}
                    />
                  </div>
                  <div className="text-danger">
                    <span>{errors.addressLine1}</span>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12">
                  <div className="floating-label">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="addressline2"
                      required
                      placeholder="Address line 2"
                      value={values?.address?.address_line_2 ?? ''}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            address_line_2: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              {/* <div className="form-group row">
                <div className="col-md-12">
                  <div className="floating-label">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="addressline2"
                      required
                      placeholder="Phone Number (Optional)"
                      value={values?.address?.phone ?? ""}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div> */}
            </form>
            <CartLinksOptions />
          </div>
          <div className="col-md-6 custom_cart_rightside_content">
            <div className={`card_expand  ${isExpanded ? 'expanded' : ''}`} style={{ border: 0 }}>
              <div className="card-header" onClick={toggleCard}>
                <span className="card-title">Summary</span>
                <img
                  src={downArrow}
                  alt="Expand/Collapse Icon"
                  className={`arrow-icon ${isExpanded ? 'expanded' : ''}`}
                />
              </div>

              {isExpanded && (
                <div className="card-body">
                  <div className="card__expand_body">
                    {/* <PromoCode
                      onApplyCoupon={onApplyCoupon}
                      subTotal={subTotal}
                      rateMultiplier={rateMultiplier}
                      currency={_selectedCountry?.currency}
                    /> */}
                    <div className="checkout_summary__item">
                      <span>Sub Total</span>
                      <span>
                        {_selectedCountry?.currency} {formatDecimal(Number(subTotal) + Number(codFee))}
                      </span>
                    </div>
                    <div className="checkout_summary__item">
                      <span>Delivery Charges</span>
                      <span>
                        {subTotal < selectedCountryDeliveryTaxes?.free_shipping_threshold * rateMultiplier ? (
                          <>
                            {_selectedCountry?.currency}{' '}
                            {standardShipping ? standardDeliveryCharges : sameDayDeliveryCharges}
                          </>
                        ) : (
                          <>Free</>
                        )}
                      </span>
                    </div>
                    {/* <div className="checkout_summary__item">
                      <span>Promo Discount</span>
                      <span>
                        {_selectedCountry?.currency} {discountAmount}
                      </span>
                    </div> */}
                  </div>
                </div>
              )}

              <div className="checkout_summary__item_total">
                <span className="checkout__total">Total</span>
                <span className="checkout__total_amount">
                  {_selectedCountry?.currency} {totalAmount}
                </span>
              </div>

              <div className="checkout_confirm__button" onClick={handelContinueShipping}>
                {!isLoading ? (
                  <p>CONTINUE TO SHIPPING</p>
                ) : (
                  <div class="spinner-border" role="status" style={{ color: 'white' }}>
                    <span className="sr-only"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} /> */}
      <LoginModal setLoginModal={setLoginModal} fromScreen={'cart'} />
    </div>
  );
};
export default CartInformation;
