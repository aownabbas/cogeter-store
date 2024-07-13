import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { toggleCartMenu } from '../../actions/Cart';
import cardPaymentIcon from '../../assets/checkout/cards.svg';
import downArrow from '../../assets/checkout/arrow-square-down.svg';
import smalDownArrow from '../../assets/checkout/arrow-down.svg';
import cashPaymentIcon from '../../assets/checkout/moneys.svg';
import tabbiIcon from '../../assets/payment/tabby.png';
import tamaraIcon from '../../assets/payment/tamara.png';
import cod from '../../assets/payment/cod.svg';
import unCheckIcon from '../../assets/checkout/tick-circle.svg';
import checkIcon from '../../assets/checkout/vuesax-linear-tick-circle.svg';
import CustomModal from '../modal/CustomModal';

import PromoCode from '../PromoCode';
import { cartItemsSummary, errorRequestHandel, formatDecimal, getCurrencyMultiplier } from '../../utils/helperFile';
import { checkTabby, checkTamara, createOrder } from '../../https/ordersRequests';
import { toast } from 'react-toastify';
import { getAddressesList } from '../../https/addressesRequests';
import { _setCountry, _toggleLoginModal, _toggleOverylay } from '../../redux/actions/settingsAction';
import { _login } from '../../redux/actions/authentication';
import FreeDeliveryInfo from '../product-related/FreeDeliveryInfo';
import PhoneNumberInput from '../resuable/phone-input/PhoneNumberInput';
import { _clearCartItems, _getAllCartItems } from '../../redux/actions/product';
import { listAllCartItems } from '../../https/cartRequests';
import PaymentMethod from '../resuable/payment-methods/PaymentMethod';
import ShippingOption from '../resuable/payment-methods/ShippingOption';
import ConfirmationModal from '../product-related/confirmation/ConfirmationModal';
import useWindowSize from '../../utils/hooks/useWindowSize';
import CartLinksOptions from './CartLinksOptions';
import axios from 'axios';
import { paymentImplementation } from '../../https/paymentImplementation';

import infoIcon from '../../assets/info.png';
import CustomProfileModal from '../custom-profile-modal/CustomProfileModal';
import { trackAddPaymentInfo, ttqTrackAddPaymentInfo } from '../../utils/analyticsEvents';

function CartShippingOptions({ hide, proceedToConfirmation, cartItems, address_id, userAddress, manuallyAddAddress }) {
  const userToken = localStorage.getItem('token');
  const { width } = useWindowSize();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [open, setOpen] = useState(false);
  const [isExpandDropdown, setIsExpandDropwn] = useState(false);
  const [cardPayment, setCardPayment] = useState(true);
  const [cashPayment, setCashPayment] = useState(false);
  const [standardShipping, setStandardShipping] = useState(true);
  const [sameDayShipping, setSameDayShipping] = useState(false);
  const [isTabbySelect, setisTabbySelect] = useState(false);
  const [isTammaraSelect, setisTammaraSelect] = useState(false);
  const _selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const [selectedCountry, setSelectedCountry] = useState(_selectedCountry ?? '');
  const _countryLists = useSelector((state) => state._general.countryList);
  const userInformation = useSelector((state) => state._auth.user);

  const [addressId, setAddressId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isAllFields, setisAllFields] = useState(false);
  const [isFromPayment, setisFromPayment] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(_selectedCountry ? _selectedCountry?.id : '');

  const [isUserEligibleForTabby, setIsUserEligibleForTabby] = useState(false);

  // Use the cartItemsSummary function to calculate subtotal and total amount

  const [values, setValues] = useState({
    currency: '',
    sub_total: '',
    discount: '',
    total_amount: '',
    payment_type: '',
    delivery_types: '',
    address_id: address_id,
    item: [],
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

  const product_detail = useSelector((state) => state.products.product_detail);

  useEffect(() => {
    setTimeout(() => {
      setisFromPayment(true);
    }, 1000);
  }, []);
  useEffect(() => {
    setSelectedCountryDeliveryTaxes(_countryDeliveryTaxes);
  }, [_selectedCountry, selectedCountry, countryDeliveryTaxes]);

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

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleDropdown = () => {
    setIsExpandDropwn(!isExpandDropdown);
  };

  const { subTotal, totalAmount, discountAmount, standardDeliveryCharges, sameDayDeliveryCharges, codFee } =
    cartItemsSummary(
      sameDayShipping,
      cashPayment,
      discountedAmount,
      cartItems,
      selectedCountryDeliveryTaxes,
      rateMultiplier,
    );

  const handleCountryChange = (e) => {
    const findSelectedCountry = _countryLists.find((country) => country.id === parseInt(e.target.value));
    dispatch(_setCountry(findSelectedCountry));
    setSelectedCountry(e.target.value);
    setStandardShipping(true);
    setSameDayShipping(false);
    setSelectedCountryId(e.target.value);
  };

  const onCheckOutClick = async () => {
    if (userInformation && (userInformation?.phone == '' || userInformation?.phone_code == '')) {
      toast.warning('Please reload the page to complete your profile.');
      return;
    }
    const session_id = localStorage.getItem('session_id');
    let items = [];
    items = cartItems?.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      price: formatDecimal(
        (item.onSale ? item.salePrice : item.regularPrice) * rateMultiplier
      ), // Replace with the actual price
    }));

    let payload = {
      data: {
        promo_code: promoCode,
        session_id: session_id,
        currency: _selectedCountry?.currency,
        sub_total: subTotal,
        cod_fee: codFee,
        discount: discountAmount,
        total_amount: totalAmount,
        payment_type: cardPayment ? 'ONLINE' : isTabbySelect ? 'TABBY' : isTammaraSelect ? 'TAMARA' : 'COD',
        delivery_types: standardShipping ? 'Standard Shipping' : 'Same Day',
        address_id: address_id,
        delivery_charges: standardShipping ? standardDeliveryCharges : sameDayDeliveryCharges,
        items: items,
        // address: userAddress ? { ...userAddress, country: userAddress?.country?.id } : manuallyAddAddress,
      },
    };
    try {
      if (cartItems?.length === 0) {
        toast.warning('Please add items to cart');
        return;
      }
      setisLoading(true);
      if (isTabbySelect) {
        // check if allow
        const tabbyResponse = await checkTabby(payload);
        trackAddPaymentInfo(selectedCountry?.currency, product_detail, promoCode, values?.payment_type, rateMultiplier);
        ttqTrackAddPaymentInfo(product_detail)
        if (tabbyResponse.status !== 200) {
          setisLoading(false);
          toast.warning(tabbyResponse.data.errorMessage ?? 'Taaby not available');
          return;
        }
      }
      if (isTammaraSelect) {
        // check if allow
        const tamaraResponse = await checkTamara(payload);
        trackAddPaymentInfo(selectedCountry?.currency, product_detail, promoCode, values?.payment_type, rateMultiplier);
        ttqTrackAddPaymentInfo(product_detail)
        if (tamaraResponse.status !== 200) {
          setisLoading(false);
          toast.warning(tamaraResponse.data.errorMessage ?? 'Tamara  not available');
          return;
        }
      }

      const response = await paymentImplementation(payload);
      if (response.status === 200) {
        //  const { jwt, user } = response.data?.data;
        if (userToken === '' || userToken === null || userToken == undefined) {
          dispatch(_login(response.data?.data.user_account));
        }
        dispatch(_clearCartItems());
        const order_id = response?.data?.data?.identifier;
        setOrderId(order_id);

        setisLoading(false);
        if (cashPayment) {
          trackAddPaymentInfo(
            selectedCountry?.currency,
            product_detail,
            promoCode,
            values?.payment_type,
            rateMultiplier,
          );
          ttqTrackAddPaymentInfo(product_detail)
          // setOpen(true);
          navigate(`/order-confirmation/${order_id}`);
        } else {
          // return;
          trackAddPaymentInfo(
            selectedCountry?.currency,
            product_detail,
            promoCode,
            values?.payment_type,
            rateMultiplier,
          );
          ttqTrackAddPaymentInfo(product_detail)
          const paymenUrl = response?.data?.data?.url;
          window.history.pushState({}, '', '');
          window.location.href = paymenUrl;
        }
      }
    } catch (error) {
      setisLoading(false);
      if (error?.response?.data?.errorCode === 'not_available') {
        setIsUserEligibleForTabby(true);
        setCardPayment(true);
        setCashPayment(false);
        setisTabbySelect(false);
        setisTammaraSelect(false);
      }
      errorRequestHandel({ error: error });
    }
  };

  const placeOrder = async (paylaod) => {
    try {
      const payment = await paymentImplementation(paylaod);

      if (payment.status === 200) {
        return;
      }
    } catch (error) {
      setisLoading(false);

      errorRequestHandel({ error: error });
    }
  };

  const onApplyCoupon = (value, promoCodeVal) => {
    setDiscountedAmount(value);
    setPromoCode(promoCodeVal);
  };

  useEffect(() => {
    setCardPayment(true);
    setisTabbySelect(false);
    setisTammaraSelect(false);
  }, [_selectedCountry]);
  // useEffect(() => {
  //   function handleResize() {
  //     // Check the screen width and set the state accordingly
  //     setIsExpanded(window.innerWidth >= 768); // Adjust the threshold as needed
  //   }

  //   // Add a resize event listener
  //   window.addEventListener("resize", handleResize);

  //   // Call the handleResize function once when the component mounts
  //   handleResize();

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const buttonRef = useRef(null);

  const handleIconClick = () => {
    // Forward the click event from the icon to the button
    // This will trigger the button's click event, which may open the modal
    buttonRef.current.click();
  };

  return (
    <div className={`_paymentContent ${hide}`}>
      <div className="container">
        <div className="row gx-5 ">
          <div className="col-md-6 mb-4 mb-md-0 ">
            {/* Left side: Form input fields */}
            {/* <div className="d-flex justify-content-between align-items-center">
              {userToken == null || userToken == "" ? (
                <>
                  <div className="col-md-10">
                    <p className="checkout__create__Account">
                      Create Cogeter Account
                    </p>
                  </div>
                  <div className="col-md-2 text-right">
                    <span
                      className="checkout__signin"
                      onClick={() => {
                        dispatch(_toggleLoginModal(true));
                        dispatch(_toggleOverylay(true));
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
              {userToken == null || userToken === "" ? (
                <>
                  <div className="form-group row">
                    <div className="col-md-6">
                      <div className="floating-label">
                        <input
                          type="text"
                          className="form-control custom-input"
                          id="firstName"
                          required
                          placeholder="First Name"
                          value={values?.user?.firstName ?? ""}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                firstName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="floating-label">
                        <input
                          type="text"
                          className="form-control custom-input"
                          id="lastName"
                          required
                          placeholder="Last Name"
                          value={values?.user?.lastName ?? ""}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                lastName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6">
                      <div className="floating-label">
                        <input
                          type="text"
                          className="form-control custom-input"
                          id="emailAddress"
                          required
                          placeholder="Email Address"
                          value={values?.user?.email ?? ""}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                email: e.target.value.replace(/\s/g, ""),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
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
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-md-12">
                      <div className="floating-label">
                        <input
                          type="password"
                          className="form-control custom-input"
                          id="Password"
                          required
                          placeholder="Password"
                          value={values?.user?.password ?? ""}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              user: {
                                ...values.user,
                                password: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div
                    className={`card_expand ${
                      isExpandDropdown ? "expanded" : ""
                    }`}
                  >
                    <div
                      className="card-header_dropdown"
                      onClick={toggleDropdown}
                    >
                      {addresses?.length == 0 ? (
                        <span>Add new address</span>
                      ) : (
                        <span>
                          {values?.address?.address_line_1 ?? "Select"}
                        </span>
                      )}

                      <img
                        src={smalDownArrow}
                        alt="Expand/Collapse Icon"
                        className={`arrow-icon ${
                          isExpandDropdown ? "expanded" : ""
                        }`}
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
                                    const findSelectedCountry =
                                      _countryLists.find(
                                        (country) =>
                                          country.id ===
                                          parseInt(item.country?.id)
                                      );
                                    dispatch(_setCountry(findSelectedCountry));
                                  }}
                                >
                                  <span className="addres_dropdown_item">
                                    {item.address_line_1}
                                  </span>
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
                <div className="col-md-6">
                  <div className="floating-label">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="City"
                      required
                      placeholder="City"
                      value={values?.address?.city ?? ""}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="floating-label">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="lastName"
                      required
                      placeholder="State"
                      value={values?.address?.state ?? ""}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-12">
                  <div className="floating-label">
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="addressline"
                      required
                      placeholder="Address line 1"
                      value={values?.address?.address_line_1 ?? ""}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          address: {
                            ...values.address,
                            address_line_1: e.target.value,
                          },
                        })
                      }
                    />
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
                      value={values?.address?.address_line_2 ?? ""}
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
              <div className="form-group row">
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
              </div>
            </form> */}
            {selectedCountry === '' ? (
              <div className="card no-border-radius">
                <div className="card-body">
                  <p className="card-text">Add address to see shipping options.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center col-md-6">
                  <p className="checkout__create__Account">Shipping Options</p>
                </div>
                <div className="checkout__card">
                  <div className="card no-border-radius">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src={cardPaymentIcon} alt="Card Payment" />
                        <div>
                          <p className="card-title mb-0 ms-4">Standard Shipping</p>
                          <p className="mb-0 ms-4 shipping_subtitle">
                            {subTotal < selectedCountryDeliveryTaxes?.free_shipping_threshold * rateMultiplier ? (
                              <>
                                {_selectedCountry?.currency} {standardDeliveryCharges}
                              </>
                            ) : (
                              <>Free</>
                            )}
                          </p>
                          {selectedCountryDeliveryTaxes?.estimated_delivery_time !== null && (
                            <p className="mb-0 ms-4 shipping_subtitle">
                              Estimated Delivery Time: {selectedCountryDeliveryTaxes?.estimated_delivery_time}
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setStandardShipping(true);
                          setSameDayShipping(false);
                        }}
                      >
                        <img src={standardShipping ? checkIcon : unCheckIcon} alt="Check Icon" />
                      </div>
                    </div>
                  </div>
                </div>
                {selectedCountryDeliveryTaxes && selectedCountryDeliveryTaxes.same_day_delivery_fee !== 0 && (
                  <div className="checkout__card">
                    <div className="card no-border-radius">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img src={cashPaymentIcon} alt="Card Payment" />
                          <div>
                            <p className="card-title mb-0 ms-4">Same Day Shipping</p>
                            <p className="mb-0 ms-4 shipping_subtitle">
                              {subTotal < selectedCountryDeliveryTaxes?.free_shipping_threshold * rateMultiplier ? (
                                <>
                                  {_selectedCountry?.currency} {sameDayDeliveryCharges}
                                </>
                              ) : (
                                <>Free</>
                              )}
                            </p>
                            <p className="mb-0 ms-4 shipping_subtitle">
                              Only orders placed before 12 PM (Available only in Sharjah, Ajman, Dubai, and Abu Dhabi).
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setStandardShipping(false);
                            setSameDayShipping(true);
                          }}
                        >
                          <img src={sameDayShipping ? checkIcon : unCheckIcon} alt="Check Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedCountryDeliveryTaxes?.note !== null && (
              <div className="mb-0 ms-0 shipping_subtitle">
                <p>{selectedCountryDeliveryTaxes?.note}</p>
              </div>
            )}

            <div className="shipping-policy">
              <p>
                For details view our{' '}
                <Link to={'/shipping-and-delivery'} className="blue-bold" target="_blank">
                  Shipping Policy
                </Link>
              </p>
            </div>

            <div className="checkout__card">
              <div className="card no-border-radius">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img src={cardPaymentIcon} alt="Card Payment" />
                    <div>
                      <p className="card-title mb-0 ms-4">Card Payment</p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setCardPayment(true);
                      setCashPayment(false);
                      setisTabbySelect(false);
                      setisTammaraSelect(false);
                      setValues({ ...values, payment_type: 'card' });
                    }}
                  >
                    <img src={cardPayment ? checkIcon : unCheckIcon} alt="Check Icon" />
                  </div>
                </div>
              </div>
            </div>

            {selectedCountryDeliveryTaxes && selectedCountryDeliveryTaxes.cod_fee !== 0 && (
              <div className="checkout__card">
                <div className="card no-border-radius">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img src={cashPaymentIcon} alt="Card Payment" />

                      <div>
                        <p className="card-title mb-0 ms-4">Cash on Delivery</p>
                        <span className="card-title mb-0 ms-4">
                          <>
                            Additional {_selectedCountry?.currency}{' '}
                            {formatDecimal(selectedCountryDeliveryTaxes?.cod_fee * rateMultiplier)}
                          </>
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setCashPayment(true);
                        setCardPayment(false);
                        setisTabbySelect(false);
                        setisTammaraSelect(false);
                        setValues({ ...values, payment_type: 'cash' });
                      }}
                    >
                      <img src={cashPayment ? checkIcon : unCheckIcon} alt="Check Icon" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!isUserEligibleForTabby && (
              <>
                {_selectedCountry?.has_tabby_support && (
                  <div className="checkout__card">
                    <div className="card no-border-radius">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img src={tabbiIcon} alt="Card Payment" />
                          <div
                            style={{
                              textAlign: 'left',
                              paddingLeft: 18,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <p className="card-title mb-1">Pay in 4. No interest, no fees.</p>

                              <button
                                ref={buttonRef}
                                type="button"
                                data-tabby-info="installments"
                                data-tabby-price={totalAmount}
                                data-tabby-currency={_selectedCountry?.currency}
                                style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                }}
                              >
                                <img
                                  src={infoIcon}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginBottom: 5,
                                    objectFit: 'contain',
                                  }}
                                  onClick={handleIconClick}
                                />
                              </button>
                            </div>
                            <span className="card-title mb-0">
                              Use any card.
                              {/* Pay a minimum of <b>{_selectedCountry?.currency}</b>{" "}
                          <b>{formatDecimal(totalAmount / 4)}</b> now, and the
                          rest over time - no hidden fees, no interest. */}
                            </span>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            setisTammaraSelect(false);

                            setisTabbySelect(true);
                            setCashPayment(false);
                            setCardPayment(false);
                            setValues({ ...values, payment_type: 'tabby' });
                          }}
                        >
                          <img
                            src={isTabbySelect ? checkIcon : unCheckIcon}
                            alt="Check Icon"
                            style={{ marginLeft: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {_selectedCountry?.has_tamara_support && (
              <div className="checkout__card">
                <div className="card no-border-radius">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img src={tamaraIcon} alt="Card Payment" style={{ objectFit: 'contain' }} />
                      <div
                        style={{
                          textAlign: 'left',
                          paddingLeft: 18,
                        }}
                      >
                        <p className="card-title mb-1">Pay with Tamara</p>
                        <span className="card-title mb-0">
                          Pay a minimum of <b>{_selectedCountry?.currency}</b> <b>{formatDecimal(totalAmount / 4)}</b>{' '}
                          now, and the rest over time - no hidden fees, no interest.
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setisTammaraSelect(true);
                        setisTabbySelect(false);
                        setCashPayment(false);
                        setCardPayment(false);
                        setValues({ ...values, payment_type: 'tamara' });
                      }}
                    >
                      <img
                        src={isTammaraSelect ? checkIcon : unCheckIcon}
                        alt="Check Icon"
                        style={{ marginLeft: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <CartLinksOptions />
          </div>
          <div className="col-md-6 custom_cart_rightside_content">
            {/* Right side: Other information */}
            <br />

            <div className={`card_expand  ${isExpanded ? 'expanded' : ''}`} style={{ border: 0 }}>
              <div className="card-header" onClick={toggleCard}>
                <span className="card-title">Summary</span>
                <img
                  src={downArrow}
                  alt="Expand/Collapse Icon"
                  className={`arrow-icon ${isExpanded ? 'expanded' : ''}`}
                />
              </div>
              {/* <div className="free__deliveryfee_container">
                <FreeDeliveryInfo />
              </div> */}
              {isExpanded && (
                <div className="card-body">
                  <div className="card__expand_body">
                    <PromoCode
                      onApplyCoupon={onApplyCoupon}
                      subTotal={subTotal}
                      rateMultiplier={rateMultiplier}
                      currency={_selectedCountry?.currency}
                    />
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
                    <div className="checkout_summary__item">
                      <span>Promo Discount</span>
                      <span>
                        {_selectedCountry?.currency} {discountAmount}
                      </span>
                    </div>
                    {(isTabbySelect || isTammaraSelect) && (
                      <div className="checkout_summary__item">
                        <span>Total</span>
                        <span>
                          {_selectedCountry?.currency} {totalAmount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!isTabbySelect && !isTammaraSelect && (
                <div className="checkout_summary__item_total">
                  <span className="checkout__total">Total</span>
                  <span className="checkout__total_amount">
                    {_selectedCountry?.currency} {totalAmount}
                  </span>
                </div>
              )}
              {(isTabbySelect || isTammaraSelect) && (
                <div className="checkout_summary__item_total">
                  <span className="checkout__total">Pay Now</span>
                  <span className="checkout__total_amount">
                    {_selectedCountry?.currency} {formatDecimal(totalAmount / 4)}
                  </span>
                </div>
              )}
              {isAllFields ? (
                <div className="checkout_confirm__button_disabled">
                  <p>CONTINUE TO PAYMENT</p>
                </div>
              ) : (
                <div className="checkout_confirm__button" onClick={onCheckOutClick}>
                  {!isLoading ? (
                    <p>CONTINUE TO PAYMENT</p>
                  ) : (
                    <div class="spinner-border" role="status" style={{ color: 'white' }}>
                      <span className="sr-only"></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* <PaymentMethod /> */}
            {/* <ShippingOption hideText={true} /> */}
          </div>
        </div>
      </div>
      <CustomModal open={open} onCloseModal={() => setOpen(false)} showCloseIcon={false}>
        <ConfirmationModal orderId={orderId} />
      </CustomModal>
      <CustomProfileModal />
    </div>
  );
}
export default CartShippingOptions;
