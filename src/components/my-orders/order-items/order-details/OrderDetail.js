import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CartItem from '../../../CartItem';
import PaymentConfirmationModal from '../../../PaymentConfirmation';
import { listOrders } from '../../../../actions/Cart';
import { fetchProducts } from '../../../../actions/Products';
import { connect, useDispatch, useSelector } from 'react-redux';
import { formatOrder, renderItemDataOrEmptyNull } from '../../../../helpers/Index';
import SuperMaster from '../../../../layouts/SuperMaster';
import { getOrdersDetails, retryPayment, updatePaymentStatus } from '../../../../https/ordersRequests';
import HomeScreenShimer from '../../../shimer/home-shimer/HomeScreenShimer';
import {
  addPreFixToMediaUrl,
  convertToTitleCase,
  copyToClicpBoard,
  errorRequestHandel,
  formatDecimal,
  openExternalLinks,
} from '../../../../utils/helperFile';
import Heading from '../../../common-components/heading';
import CustomText from '../../../common-components/Custom-Text';
import style from './style.module.scss';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CustomButton from '../../../common-components/custom-button';
import DangerAlertIcon from '../../../../assets/icons/danger.svg';
import useWindowSize from '../../../../utils/hooks/useWindowSize';
import Collapse from 'react-bootstrap/Collapse';
import ArrowDown from '../../../../assets/icons/arrow-down.svg';
import ProductDetaillShimer from '../../../shimer/address-shimer/product-detail-shimer/ProductDetaillShimer';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import copy from '../../../../assets/copy.svg';

import { toast } from 'react-toastify';
import PageNotFound from '../../../../screens/PageNotFound';

function OrderDetail(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();
  const [open, setOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const payNow = () => {
    setIsPaid(true);
  };
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const hasCalledUpdatePaymentStatusAPI = useRef(false);
  const queryParams = new URLSearchParams(location.search);

  const isLoggedIn = useSelector((state) => state._auth.isAuthenticated);

  useEffect(() => {
    const isPayment = queryParams.get('isPayment');
    const _identifier = params?.id?.trim();
    if (isPayment && !hasCalledUpdatePaymentStatusAPI.current) {
      hasCalledUpdatePaymentStatusAPI.current = true;
      _updatePaymentStatus(_identifier);
      return; // Exit early from the effect
    }
    if (!isPayment) {
      fetchOrdersDetails(_identifier);
    }
  }, []);

  const _updatePaymentStatus = async (_identifier) => {
    setLoading(true);
    try {
      const response = await updatePaymentStatus(_identifier);

      if (response.status === 200) {
        if (response?.data?.paymentStatus) {
          toast.success('Order placed');
        } else {
          toast.error(response?.data?.message);
        }

        fetchOrdersDetails(_identifier);
      }
    } catch (error) {
      errorRequestHandel({ error: error });
      fetchOrdersDetails(_identifier);
    }
  };

  const fetchOrdersDetails = async (_identifier) => {
    try {
      setLoading(true);
      const response = await getOrdersDetails(_identifier);
      if (response.status === 200) {
        setOrder(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const _retryPayment = async () => {
    try {
      setLoading(true);
      const response = await retryPayment(order?.identifier, order?.payment?.type);
      if (response.status === 200) {
        const paymenUrl = response?.data?.data?.url;
        window.history.pushState({}, '', '');
        window.location.href = paymenUrl;
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const shouldShowRetryPaymentLink = () => {
    if (
      ['Card', 'TABBY', 'TAMARA'].indexOf(order?.payment?.type) > -1 &&
      ['Pending', 'Failed', 'Cancelled'].includes(order?.payment?.status)
    ) {
      const orderDate = new Date(order?.order_date);
      const currentDate = new Date();
      const diffInMinutes = (currentDate - orderDate) / 1000 / 60;
      if (diffInMinutes <= 30) {
        return true;
      }
      return false;
    }
    return false;
  };

  if (loading) {
    return (
      <SuperMaster>
        <ProductDetaillShimer />
      </SuperMaster>
    );
  }

  const isSubTotalDecimal = order.sub_total % 1 !== 0;
  
  return (
    <>
      {order === null || order === undefined || Object.keys(order).length === 0 ? (
        <PageNotFound />
      ) : (
        <SuperMaster hasFooter={true}>
          <div className={`_confirmationContent _confirmationContent_sticky ${props?.hide} _orderDetail`}>
            <div className={`_row ${style.mainPageContainer}`}>
              <div className="_column1">
                <div className={`${style.headerContainer}`}>
                  <div>
                    <Heading title={`Order # ${order?.order_no}`} variant="one" />
                  </div>
                  <div onClick={() => copyToClicpBoard(order?.order_no)}>
                    <img src={copy} />
                  </div>

                  <CustomText
                    title={formatOrder(order?.order_date)}
                    variant="two"
                    // className={style.desktopView}
                  />
                </div>
                <div className={style.headerStatus}>
                  {order?.awb !== '' && (
                    <div className={style.trakingNumberContainer}>
                      <div>
                        <CustomText title={`Tracking Number: ${order?.awb}`} />
                      </div>
                      <div onClick={() => copyToClicpBoard(order?.awb)}>
                        <img src={copy} />
                      </div>
                    </div>
                  )}

                  <div>
                    <CustomText
                      title={`Order Status: ${convertToTitleCase(order?.status)}`}
                      className={style.paymentStatus}
                    />
                  </div>
                  <div>
                    <CustomText className={style.paymentStatus} title={`Payment: ${order?.payment?.status}`} />
                  </div>
                </div>

                {/* <div className="_item">
              <div className={`_body ${style.sameDayShippingBox}`}>
                <div>
                  <Heading title="Same Day Shipping" variant="two" />
                  <CustomText
                    style={{ lineHeight: "20px" }}
                    title={`Additional ${order?.currency} 30. On orders before 12 PM (Only for Sharjah, Ajman, Dubai, Abu Dhabi`}
                  />
                </div>
                <div className={style.aedRateBox}>
                  <CustomText
                    style={{ lineHeight: "20px" }}
                    title={`${order?.currency} 30`}
                    variant="three"
                  />
                </div>
              </div>
            </div> */}
                <div className="_item">
                  <div className="_body">
                    <div style={{ width: '100%' }}>
                      <Heading
                        style={
                          {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordBreak: 'break-all',
                          }
                        }
                        title={order?.address?.city ?? order?.address?.state}
                        variant="two"
                        ellipses={true}
                      />
                      <CustomText
                        style={{
                          lineHeight: '20px',
                          whiteSpace: 'nowrap !important',
                          overflow: 'hidden !important',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-all !important',
                        }}
                        title={order?.address?.address_line_1}
                        variant="one"
                      />
                      <CustomText
                        style={{
                          lineHeight: '20px',
                          whiteSpace: 'nowrap !important',
                          overflow: 'hidden !important',
                          wordBreak: 'break-all !important',
                          textOverflow: "ellipsis",
                        }}
                        title={order?.address?.address_line_2}
                        variant="two"
                      />
                    </div>
                  </div>
                </div>
                <div className="_item">
                  <div className="_body">
                    <div className={style.paymentMethodContainer}>
                      <Heading title="Payment Method" variant="two" />
                      <CustomText className="mt-2" title={order?.payment?.type} variant="one" />
                      {isLoggedIn && (
                        <>
                          {shouldShowRetryPaymentLink() && (
                            <div className={style.paymentAlert}>
                              <img src={DangerAlertIcon} alt="icon" />
                              <CustomText title="Please retry to complete the order." variant="one" />
                            </div>
                          )}
                        </>
                      )}

                      <br />
                      {isLoggedIn && (
                        <>
                          {shouldShowRetryPaymentLink() && (
                            <div onClick={() => _retryPayment()}>
                              <CustomText
                                className={style.retryCardPayment}
                                title={`Retry ${order?.payment?.type} Payment`}
                                variant="five"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {width > 768 && (
                <div className="_column2">
                  <div className={style.summaryHeader}>
                    <Heading title={`Summary`} variant="one" />
                  </div>
                  <div className="_body">
                    <div>
                      <CustomText style={{ fontWieght: '400' }} title="Sub Total" variant="two" />
                      <CustomText
                        style={{ fontWieght: '400' }}
                        // title={`${order?.currency} ${Number(order?.sub_total) + Number(order?.cod_fee)}`}
                        title={`${order.currency} ${formatDecimal(Number(order?.sub_total) + Number(order?.cod_fee))
                        }`}
                        variant="four"
                      />
                    </div>
                    <div>
                      <CustomText style={{ fontWieght: '400' }} title="Delivery Charges" variant="two" />
                      <CustomText
                        style={{ fontWieght: '400' }}
                        title={`${order?.currency} ${order?.delivery_charges}`}
                        variant="four"
                      />
                    </div>
                    <div>
                      <CustomText style={{ fontWieght: '400' }} title="Promo Discount" variant="two" />
                      <CustomText
                        style={{ fontWieght: '400' }}
                        title={`${order?.currency} ${order?.discount}`}
                        variant="four"
                      />
                    </div>
                  </div>
                  <Row className="justify-content-between mt-2">
                    <Col>
                      <Heading style={{ fontWieght: '700' }} title="Total" variant="three" />
                    </Col>
                    <Col>
                      <Heading
                        style={{
                          fontWieght: '500',
                          textAlign: 'right',
                          color: '#7089FB',
                        }}
                        title={`${order?.currency} ${Number(order?.amount)}`}
                        variant="three"
                      />
                    </Col>
                  </Row>
                  {order?.tracking_url?.length > 0 && (
                    <Form.Group className="mb-3 _btnContainer">
                      <Button
                        onClick={() => openExternalLinks(order?.tracking_url)}
                        variant="primary"
                        className="_btnFlatCenter _checkoutBtn"
                      >
                        Track Order
                      </Button>
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3  _btnContainer">
                    <div onClick={() => navigate('/customer-support')} variant="primary" className="_borderdButton">
                      Support
                    </div>
                  </Form.Group>
                </div>
              )}
            </div>
            <div className="_row _cartItems">
              <Heading title={`Items (${order?.items?.length || 0})`} variant="one" />
              {order?.items?.map((item, index) => {
                return (
                  <div className={`_column2 ${style.itemContainer}`} key={index}>
                    <div className="_body m-2">
                      <Row>
                        <img src={addPreFixToMediaUrl(item?.cover_image)} />
                        <Col className={style.itemRight}>
                          <CustomText variant="four" title={item?.title} />
                          <div>
                            <CustomText
                              style={{ display: 'inline' }}
                              variant="four"
                              title={`${formatDecimal(item?.price) ?? ''}  ${order?.currency}`}
                            />{' '}
                          </div>
                          <div>
                            <CustomText
                              className={style.variantSize}
                              variant="four"
                              title={`Size : ${item?.variant_size}`}
                            />
                          </div>
                          <div>
                            <CustomText
                              className={style.variantSize}
                              variant="four"
                              title={`Qty : ${item?.quantity}`}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                );
              })}
            </div>
            <PaymentConfirmationModal isPaid={isPaid} setIsPaid={setIsPaid} />
            {width < 768 && (
              <div className={style.collapseContainer}>
                <div className={style.collapsedHeader}>
                  <Heading variant="two" title="SUMMARY" />
                  <img
                    className={open && style.arrrowImage}
                    onClick={() => setOpen(!open)}
                    src={ArrowDown}
                    alt="icons"
                  />
                </div>
                {!open && (
                  <>
                    <Row className="justify-content-between mt-2">
                      <Col>
                        <Heading style={{ fontWieght: '700' }} title="Total" variant="three" />
                      </Col>
                      <Col>
                        <Heading
                          style={{
                            fontWieght: '500',
                            textAlign: 'right',
                            color: '#7089FB',
                          }}
                          title={`${order?.currency} ${Number(order?.amount)}`}
                          variant="three"
                        />
                      </Col>
                    </Row>
                    {order?.tracking_url && (
                      <Form.Group className="mb-3 _btnContainer">
                        <Button
                          onClick={() => window.open(order?.tracking_url, '_blank')}
                          variant="primary"
                          className="_btnFlatCenter _checkoutBtn"
                        >
                          Track Order
                        </Button>
                      </Form.Group>
                    )}
                    <Form.Group className="mb-3  _btnContainer">
                      <div
                        onClick={() => navigate('/customer-support')}
                        variant="primary"
                        // className="_btnFlatCenter"
                        className="_borderdButton"
                      >
                        Support
                      </div>
                    </Form.Group>
                  </>
                )}

                <div>
                  <Collapse in={open} dimension="height">
                    <div id="example-collapse-text" className={style.stickyBottom}>
                      <div className="_column2 w-100">
                        <div className="_body">
                          <div className="mt-4">
                            <CustomText style={{ fontWieght: '400' }} title="Sub Total" variant="two" />
                            <CustomText
                              style={{ fontWieght: '400' }}
                              title={`${order?.currency} ${order?.sub_total}`}
                              variant="four"
                            />
                          </div>
                          <div>
                            <CustomText style={{ fontWieght: '400' }} title="Delivery Charges" variant="two" />
                            <CustomText
                              style={{ fontWieght: '400' }}
                              title={`${order?.currency} ${order?.delivery_charges}`}
                              variant="four"
                            />
                          </div>
                          <div>
                            <CustomText style={{ fontWieght: '400' }} title="Promo Discount" variant="two" />
                            <CustomText
                              style={{ fontWieght: '400' }}
                              title={`${order?.currency} ${order?.discount}`}
                              variant="four"
                            />
                          </div>
                        </div>
                        <Row className="justify-content-between mt-2">
                          <Col>
                            <Heading style={{ fontWieght: '700' }} title="Total" variant="three" />
                          </Col>
                          <Col>
                            <Heading
                              style={{
                                fontWieght: '500',
                                textAlign: 'right',
                                color: '#7089FB',
                              }}
                              title={`${order?.currency} ${Number(order?.amount)}`}
                              variant="three"
                            />
                          </Col>
                        </Row>
                        {order?.tracking_url?.length > 0 && (
                          <Form.Group className="mb-3 _btnContainer">
                            <Button
                              onClick={() => window.open(order?.tracking_url, '_blank')}
                              variant="primary"
                              className="_btnFlatCenter _checkoutBtn"
                            >
                              Track Order
                            </Button>
                          </Form.Group>
                        )}
                        <Form.Group className="mb-3  _btnContainer">
                          <div
                            onClick={() => navigate('/customer-support')}
                            variant="primary"
                            // className="_btnFlatCenter"
                            className="_borderdButton"
                          >
                            Support
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            )}
          </div>
        </SuperMaster>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    orders: state.cart?.orders,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToOrders: (user_id) => dispatch(listOrders(user_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
