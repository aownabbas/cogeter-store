import React, { useEffect, useState } from 'react';
import SuperMaster from '../layouts/SuperMaster';
import Address from '../components/Address';
import AddToCart from '../components/AddToCart';
import CartBreadCrumbs from '../components/CartBreadCrumbs';
import CheckoutInformation from '../components/CheckoutInformation';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { _phoneNumberSet } from '../redux/actions/generalActions';
import CustomProfileModal from '../components/custom-profile-modal/CustomProfileModal';
import CartInformation from '../components/chekout-cartitems/CartInformation';
import CartShippingOptions from '../components/chekout-cartitems/CartShippingOptions';
import CartPayment from '../components/chekout-cartitems/CartPayment';
import CartLinksOptions from '../components/chekout-cartitems/CartLinksOptions';
import { Helmet } from 'react-helmet';
import { errorRequestHandel, isValidEmailAddress } from '../utils/helperFile';
import { userRegister } from '../https/authentication';
import { _register } from '../redux/actions/authentication';
import { addNewAddress } from '../https/addressesRequests';

function Cart() {
  const cartItems = useSelector((state) => state?._products.cartItems);
  const [addressId, setAddressId] = useState('');
  const _selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const userToken = localStorage.getItem('token');

  const [userAddress, setUserAddress] = useState();
  const [manuallyAddAddress, setManuallyAddAddress] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const overlayEnabled = useSelector((state) => state._settings.overlayEnabled);
  useEffect(() => {
    // Update the isMobile state based on the screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust the threshold for mobile screens
    };

    // Initial call to set the initial value
    handleResize();

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (location.state && location.state.tabIndex !== undefined) {
      setSelectedTab(location.state.tabIndex);
    }
  }, [location.state]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(_phoneNumberSet(true));
    }, 1000);
  }, []);

  const dispatch = useDispatch();

  const renderCartItemsDetails = () => {
    return (
      <AddToCart
        onCheckout={() => {
          if (cartItems.length === 0) {
            toast.warning('Please add products to cart');
            return;
          } else {
            setSelectedTab(1);
          }
        }}
      />
    );
  };

  const renderInformations = () => {
    // return <CheckoutInformation cartItems={cartItems} />;
    return (
      <CartInformation
        cartItems={cartItems}
        onContinueShipping={(id) => continueToShipping(id)}
        setUserAddress={setUserAddress}
        setManuallyAddAddress={setManuallyAddAddress}
      />
    );
  };
  const renderShippingOptions = () => {
    return (
      <CartShippingOptions
        cartItems={cartItems}
        address_id={addressId}
        userAddress={userAddress}
        manuallyAddAddress={manuallyAddAddress}
      />
    );
  };
  const renderCartPayment = () => {
    return <CartPayment />;
  };

  const renderCaseView = (param) => {
    switch (param) {
      case 0:
        return renderCartItemsDetails();
        break;
      case 1:
        return renderInformations();
        break;
      case 2:
        return renderShippingOptions();
        break;
      case 3:
        return renderCartPayment();
        break;
      default:
        return renderCartItemsDetails();
        break;
    }
  };

  const continueToShipping = async (id) => {
    setSelectedTab(2);
    setAddressId(id);
  };

  return (
    <>
      <div
        className={`master__div ${!isMobile && overlayEnabled ? "master__div__overlay_disabled" : ""
          }`}
        id="cartContainer"
        style={{
          height: '100vh',
          paddingTop: 20,
          width: '100%',
        }}
      >
        <div
          className={!isMobile && overlayEnabled ? "master__div__overlay" : ""}
        />

        <div className="cart_header__logo">
          <img
            onClick={() => {
              window.location.href = '/';
            }}
            src={process.env.PUBLIC_URL + '/imgs/logo.svg'}
            alt="logo"
            style={{ cursor: 'pointer' }}
          />
        </div>
        <CartBreadCrumbs
          selectedTab={selectedTab}
          onTabCart={() => setSelectedTab(0)}
          onTabInformation={() => setSelectedTab(1)}
          onTabShippingOptions={() => setSelectedTab(2)}
          onTabPaymentOption={() => setSelectedTab(3)}
        />
        <section id="content">{renderCaseView(selectedTab)}</section>

      </div>

    </>
  );
}
export default Cart;
