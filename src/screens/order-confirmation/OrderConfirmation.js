import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import thankYouMessage from '../../assets/order-confirmation.svg';
import paymentFaild from '../../assets/order-faild.svg';
import loaderImage from '../../assets/loaderIcon.png';
import SuperMaster from '../../layouts/SuperMaster';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updatePaymentStatus } from '../../https/ordersRequests';
import { toast } from 'react-toastify';
import { errorRequestHandel, getCurrencyMultiplier } from '../../utils/helperFile';
import { trackPurchase, ttqTrackCompletePayment } from '../../utils/analyticsEvents';
import { useSelector } from 'react-redux';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const isPayment = queryParams.get('isPayment');
  const _identifier = params?.id?.trim();
  const hasCalledUpdatePaymentStatusAPI = useRef(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  const _selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const product_detail = useSelector((state) => state.products.product_detail);

  useEffect(() => {
    setRateMultiplier(getCurrencyMultiplier(exchangeRates, _selectedCountry?.currency));

    const isPayment = queryParams.get('isPayment');
    const _identifier = params?.id?.trim();
    trackPurchase(_selectedCountry?.currency, product_detail, rateMultiplier, _identifier);
    ttqTrackCompletePayment(product_detail);

    if (isPayment && !hasCalledUpdatePaymentStatusAPI.current) {
      hasCalledUpdatePaymentStatusAPI.current = true;
      _updatePaymentStatus(_identifier);
      return; // Exit early from the effect
    } else {
      setPaymentSuccess(true);
      setLoading(false);
    }
  }, []);

  const _updatePaymentStatus = async (_identifier) => {
    setLoading(true);
    try {
      const response = await updatePaymentStatus(_identifier);
      if (response.status === 200) {
        if (response?.data?.paymentStatus) {
          //   toast.success("Order placed");
          setPaymentSuccess(true);
          setLoading(false);
        } else {
          // toast.error(response?.data?.message);
          setPaymentSuccess(false);
          setLoading(false);
        }
      }
    } catch (error) {
      errorRequestHandel({ error: error });
      setLoading(false);
    }
  };

  return (
    <SuperMaster>
      {loading ? (
        <div className="animated__loader_container">
          <div className="animated__loader">
            <img src={loaderImage} />
          </div>
        </div>
      ) : (
        <div className="order__confirmation__container">
          {paymentSuccess ? (
            <div className="order__confirmation__body">
              <div className="order__confirmation__message">
                <img src={thankYouMessage} />
                <p>For shopping with us</p>
              </div>
              <div className="order__confirmation__description">
                <span>Your order has been confirmed.</span>
                <p>You will receive a confirmation email soon.</p>
              </div>
              <div className="order__confirmation__buttons">
                <div className="order__confirmation__button" onClick={() => navigate('/')}>
                  <p>Continue Shopping</p>
                </div>
                <div
                  className="order__confirmation__view_button"
                  onClick={() => navigate(`/orders/details/${_identifier}`)}
                >
                  <p>View Order Details</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="order__confirmation__body">
              <div className="order__confirmation__message">
                <img src={paymentFaild} />
              </div>
              <div className="order__confirmation__description">
                <span>Payment Failed.</span>
                <p>Please retry payment to compelete the order.</p>
              </div>
              <div className="order__confirmation__buttons">
                <div className="order__confirmation__button" onClick={() => navigate(`/orders/details/${_identifier}`)}>
                  <p>Order Detail</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </SuperMaster>
  );
};

export default OrderConfirmation;
