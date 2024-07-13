import React, { useEffect, useState, useRef } from 'react';
import { Accordion, Button, Col, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import rulerIcon from '../../src/assets/ruler.svg';
import CustomModal from '../components/modal/CustomModal';
import { calculateDiscountPercentage, moveToTop } from '../helpers/Index';
import WishlistFilledDesktopIcon from '../../src/assets/icons/desktop-icons/wishlist-filled-desktop-icon.svg';
import WishlistUnfilledDesktopIcon from '../../src/assets/icons/desktop-icons/wishlist-unfilled-desktop-icon.svg';
import ShareDesktopIcon from '../../src/assets/icons/desktop-icons/share-desktop-icon.svg';
import CartModal from './CartModal';
import { useDispatch, useSelector } from 'react-redux';
import WishListModal from './WishListModal';
import './style.css';
import PairWith from './product-details/pair-with/PairWith';
import { formatDecimal, formatRichText, getCurrencyMultiplier } from '../utils/helperFile';
import { addPreFixToMediaUrl } from '../utils/helperFile';
import {
  _ToggleCartModal,
  _addItemToCart,
  _toggleWishlistModal,
  _toggleWishlistProduct,
} from '../redux/actions/product';
import SizeChart from './size-chart/SizeChart';
import { _setSelectedCategory } from '../redux/actions/category';
import { _toggleLoginModal, _toggleOverylay } from '../redux/actions/settingsAction';
import { addProductToWishList } from '../https/wishlistRequests';
import { toast } from 'react-toastify';
import CustomCarousel from './carousel/CustomCarousel';

import copy from 'copy-to-clipboard';
import OutOfStock from './resuable/out-of-stock/OutOfStock';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import PaymentMethod from './resuable/payment-methods/PaymentMethod';
import ShippingOption from './resuable/payment-methods/ShippingOption';
import ProductMediaSlider from './carousel/ProductMediaSlider';
import Tabby from './resuable/tabbi/Tabby';
import endPoints from '../https/endPoints';
import ProductStoriesModal from './product-stories-modal/ProductStoriesModal';
import ProductMobileStories from './product-stories-modal/ProductMobileStories';
import { trackAddToCart, trackViewItem, ttqTrackViewContent, ttqtrackAddToCart } from '../utils/analyticsEvents';


function ProductDetail({ productDetials, selectSimilarProducts }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const videoRefs = useRef(productDetials.stories.map(() => React.createRef()));

  const [cartModal, setCartModal] = useState(false);
  const [wishListModel, setWishListModel] = useState(false);
  const [_variantSize, _setVariantSize] = useState('XL');
  const [_variantId, _setVariantId] = useState('X');

  const dispatch = useDispatch();
  const [sizeChartModalOpen, setSizeChartModalOpen] = useState(false);

  const onOpenModal = () => setSizeChartModalOpen(true);
  const onCloseModal = () => setSizeChartModalOpen(false);
  const [selectedVariant, setSelectedVariant] = useState(productDetials?.variants[0]);
  const [variantSize, setVariantSize] = useState(productDetials?.variants[0].size);

  const selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const exchangeRates = useSelector((state) => state._general.exchangeRates);
  const [rateMultiplier, setRateMultiplier] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setRateMultiplier(getCurrencyMultiplier(exchangeRates, selectedCountry?.currency));

    // fire view item event
    trackViewItem(productDetials,selectedCountry?.currency,rateMultiplier)
    ttqTrackViewContent(productDetials)
  }, [selectedCountry, exchangeRates]);
  const userToken = localStorage.getItem('token');

  const [_isFav, setIsFav] = useState(productDetials?.is_wishlist ?? false);

  const [sortedStories, setSortedStories] = useState(productDetials?.stories ?? []);
  useEffect(() => {
    // Update the refs when the number of stories changes
    videoRefs.current = productDetials.stories.map(() => videoRefs.current.pop() || React.createRef());
  }, [productDetials.stories]);

  const isSaleOn = () => {
    const { on_sale, sale_price, regular_price } = productDetials;
    return (
      <div className="_price">
        <span>
          {on_sale ? (
            <>
              <a href="#" className="strike_through">
                {formatDecimal(regular_price * rateMultiplier)} {selectedCountry?.currency}
              </a>
              <a href="#">
                {formatDecimal(sale_price * rateMultiplier)} {selectedCountry?.currency}
              </a>
            </>
          ) : (
            <>
              <a href="#" style={{ display: 'none' }}></a>
              <a href="#">
                {formatDecimal(regular_price * rateMultiplier)} {selectedCountry?.currency}
              </a>
            </>
          )}
        </span>
        {/* {discount && <span>{discount}% off</span>} */}
        {on_sale && (
          <div className="product_sale__container">
            <p>{calculateDiscountPercentage(sale_price, regular_price, on_sale)}% OFF</p>
          </div>
        )}
      </div>
    );
  };

  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  const markProductFavourite = async (item) => {
    if (userToken == null || userToken === undefined || userToken === '') {
      dispatch(_toggleLoginModal(true));
      dispatch(_toggleOverylay(true));
      return;
    }
    try {
      const action = _isFav ? 'remove' : 'add';
      setIsFav(action === 'add' ? true : false);
      //dispatch(_toggleWishlistProduct(item.id));
      const data = {
        product: item.id,
      };
      const response = await addProductToWishList({ data: data });
      if (response.status === 200) {
        if (action === 'add') {
          // dispatch(_toggleWishlistModal(true));
          // dispatch(_toggleOverylay(true));
          toast.success('Product added to wishlist');
        } else {
          toast.success('Product removed from wishlist');
        }
      }
    } catch (error) {
      dispatch(_toggleWishlistProduct(item.id));
    }
  };

  const shareProduct = () => {
    const productUrl = window.location.href;
    copy(productUrl);
    toast.success('Copied');
  };

  const isOutOfStock = productDetials?.variants.every((product) => product.quantity === '0' || product.quantity === 0);

  useEffect(() => {
    let isVariantSet = false;
    if (variantSize !== null && variantSize !== undefined) {
      productDetials?.variants?.map((item) => {
        if (item.size === variantSize) {
          if (item.quantity !== 0) {
            //set previous selected size
            setSelectedVariant(item);
            isVariantSet = true;
          }
        }
      });
    }
    if (!isVariantSet) {
      const firstNonZeroQuantityItem = productDetials?.variants?.find((item) => item.quantity !== 0);
      if (firstNonZeroQuantityItem) {
        setSelectedVariant(firstNonZeroQuantityItem);
      }
    }
    // if (variantSize)
  }, [location.pathname, productDetials]);

  useEffect(() => {
    function handleResize() {
      // Check the screen width and set the state accordingly
      setIsMobile(window.innerWidth >= 768); // Adjust the threshold as needed
    }

    // Add a resize event listener
    window.addEventListener('resize', handleResize);

    // Call the handleResize function once when the component mounts
    handleResize();

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [openStoriesModal, setOpenStoriesModal] = useState(false);
  const [clickedStoryIndex, setClickedStoryIndex] = useState(0);
  useEffect(() => {
    const productGalleryListElement = document.querySelector('._productGalleryList');
    const rightPanelElement = document.querySelector('._rightPanel');

    if (openStoriesModal) {
      productGalleryListElement.classList.add('blur-content');
      rightPanelElement.classList.add('blur-content');
    } else {
      productGalleryListElement.classList.remove('blur-content');
      rightPanelElement.classList.remove('blur-content');
    }
  }, [openStoriesModal]);

  const [productStories, setProductStories] = useState(productDetials?.stories);

  function sortStories(index) {
    if (index < 0 || index >= productDetials?.stories.length) {
      return;
    }
    const itemToMove = productDetials?.stories[index];
    const newArray = [...productDetials?.stories];
    newArray.splice(index, 1); // Remove the item from its current position
    newArray.unshift(itemToMove); // Add it to the beginning of the array
    setSortedStories(newArray);
  }

  const handleVideoClick = (index) => {
    const specificStoryUrl = productDetials.stories[index].file;
    setScrollPosition(window.scrollY);

    sortStories(index);
    setClickedStoryIndex(index);
    setOpenStoriesModal(true);

    videoRefs.current.forEach((ref, i) => {
      ref.current.pause();
    });
  };

  const handleModalClose = () => {
    setOpenStoriesModal(false);

    videoRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.play();
      }
    });
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 200);
  };

  return (
    <>
      <>
        {!isMobile ? (
          <ProductMediaSlider product={productDetials} isFav={_isFav} markProductFavourite={markProductFavourite} />
        ) : null}
        <Col lg={7} xl={7} sm={12} className="_leftPanel _pc _productGalleryList">
          <div className="_item">
            {/* cover images */}
            <img src={addPreFixToMediaUrl(productDetials?.cover_image)} alt={'/imgs/no_img.png'} loading="lazy" />
            {/* favorite buttons desktop */}
          </div>
          {/* product video desktop */}
          <div className="product_sub__items">
            <div className="product_sub__item">
              <video
                key={productDetials?.identifier}
                className="video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source
                  src={addPreFixToMediaUrl(productDetials?.video)}
                  //src="https://cdn.shopify.com/videos/c/vp/3fc94b24695346a7b23e6d90fb88f906/3fc94b24695346a7b23e6d90fb88f906.HD-1080p-7.2Mbps-16047378.mp4s"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* product gallery desktop */}
          <div className="product_sub__items">
            <div className="product_sub__item">
              {productDetials?.gallery?.length === 0 ? (
                <img src={'/imgs/no_img.png'} alt={'/imgs/no_img.png'} />
              ) : (
                <>
                  {productDetials?.gallery.map((item, index) => {
                    return <img key={index} src={addPreFixToMediaUrl(item.url)} alt={'/imgs/no_img.png'} />;
                  })}
                </>
              )}
            </div>
          </div>
        </Col>

        <Col lg={5} xl={5} sm={12} className="_rightPanel _pc">
          <div className="_productDetail">
            <div id="header">
              <div className="_detail">
                <p
                  // className="_hide"
                  style={{ color: '#7089FB', cursor: 'pointer' }}
                  onClick={() => handelClickOnCategory(productDetials?.category?.identifier)}
                >
                  {productDetials?.category.title}
                </p>
                <h4>{productDetials?.title}</h4>
              </div>

              <div
                className="_icons _hide"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 60,
                  justifyContent: 'space-between',
                }}
              >
                <div onClick={() => markProductFavourite(productDetials)} style={{ cursor: 'pointer' }}>
                  {_isFav ? (
                    <>
                      <img
                        src={WishlistFilledDesktopIcon}
                        alt={'/imgs/no_img.png'}
                        data-productid={productDetials?.id}
                        data-is_favorite="0"
                        data-add="addToWishList"
                        loading="lazy"
                        style={{
                          marginTop: '3px',
                          width: '25px',
                          height: '21px',
                        }}
                      />
                    </>
                  ) : (
                    <img
                      src={WishlistUnfilledDesktopIcon}
                      alt={'/imgs/no_img.png'}
                      data-productid={productDetials?.id}
                      data-is_favorite="1"
                      data-add="addToWishList"
                      loading="lazy"
                      style={{
                        marginTop: '3px',
                        width: '25px',
                        height: '21px',
                      }}
                    />
                  )}
                </div>

                <div onClick={shareProduct} style={{ cursor: 'pointer' }}>
                  <img src={ShareDesktopIcon} alt={'/imgs/no_img.png'} loading="lazy" width="25px" height="21px" />
                </div>
              </div>
            </div>
            <div id="body">
              {isSaleOn()}
              <Tabby
                amount={formatDecimal(
                  (productDetials?.is_sale ? productDetials?.sale_price : productDetials?.regular_price) *
                  rateMultiplier,
                )}
              />

              <div className="hrow" />
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  marginTop: -10,
                  marginBottom: 5,
                }}
              >
                Available Colors
              </p>
              <div style={{ display: 'flex' }}>
                {productDetials?.similar_products.map((prod, index) => {
                  return (
                    <div
                      key={index}
                      id="items"
                      onClick={() => {
                        navigate(`/products/${prod?.identifier}`);
                      }}
                    >
                      <div className="_item">
                        <img
                          data-img="true"
                          src={addPreFixToMediaUrl(prod?.url)}
                          alt={'/imgs/no_img.png'}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="hrow" />
              {productDetials?.stories?.length !== 0 && (
                <>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      marginTop: -10,
                      marginBottom: 5,
                    }}
                  >
                    Stories
                  </p>
                  <div className="stories_horizontal_scroll mt-2">
                    <div className="d-flex">
                      {productDetials.stories.length > 0 &&
                        productDetials.stories?.map((item, index) => (
                          <div
                            key={item.id}
                            className={`col-${!isMobile ? '4' : '3'}${index === 0 ? '' : ' ms-2'}`}
                            onClick={() => handleVideoClick(index)}
                          >
                            <div className="w-100 pointer">
                              <div className="stories_video">
                                <video
                                  key={item.id}
                                  ref={videoRefs.current[index]}
                                  className="story_video"
                                  autoPlay={!openStoriesModal}
                                  muted
                                  loop
                                  playsInline
                                  preload="metadata"
                                >
                                  <source src={item?.file} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                              <div className="mt-2 story_title">{item?.title}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {productDetials.stories.length !== 0 && <div className="hrow" />}
              <div id="size">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Size</span>

                  {Object.keys(productDetials?.size_guide).length > 0 && (
                    <div className="size__chart" onClick={onOpenModal}>
                      <img src={rulerIcon} />
                      <span>Size Chart</span>
                    </div>
                  )}
                </div>
                <div id="buttons">
                  {productDetials?.variants?.length > 0 &&
                    productDetials?.variants.map((variant, index) => {
                      const isDisabled = variant.quantity === '0' || variant.quantity === 0; // Check if quantity is 0
                      return (
                        <Button
                          key={index}
                          onClick={() => {
                            setVariantSize(variant.size);
                            setSelectedVariant(variant);
                          }}
                          data-size="/imgs/products/1.png"
                          className={`primary ${selectedVariant?.id === variant.id ? '_active' : ''} ${isDisabled ? 'crossed-out' : ''
                            }`} // Apply crossed-out class if disabled
                          disabled={isDisabled} // Disable the button if quantity is 0
                          style={{ padding: 0 }}
                        >
                          {variant?.size}
                        </Button>
                      );
                    })}
                </div>
              </div>
              {isOutOfStock ? (
                <OutOfStock />
              ) : (
                <div id="addToCard">
                  <Form.Group className="mb-3 _btnContainer">
                    <Button
                      data-productid={productDetials?.id}
                      onClick={(e) => {
                        if (selectedVariant === null || selectedVariant === undefined || selectedVariant === '') {
                          toast.warning('Please select size');
                          return;
                        }
                        dispatch(_ToggleCartModal(true));
                        dispatch(_addItemToCart(productDetials, selectedVariant));
                        dispatch(_toggleOverylay(true));
                        trackAddToCart(productDetials, selectedVariant, rateMultiplier, selectedCountry?.currency);
                        ttqtrackAddToCart(productDetials, selectedVariant);
                      }}
                      variant="primary"
                      className="_btnFlatCenter"
                    >
                      Add To Cart
                    </Button>
                  </Form.Group>
                </div>
              )}
              <PaymentMethod />
              <div className="hrow" />
              <ShippingOption />
              <div className="hrow" />
            </div>

            <div id="footer" className="_productDetailsItemContainer">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Details</Accordion.Header>
                  <Accordion.Body>
                    <div className="_item" id="markdown-container">
                      <ReactMarkdown>{formatRichText(productDetials?.details)}</ReactMarkdown>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              {productDetials?.common_details?.map((item, index) => {
                return (
                  <Accordion key={index}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header className="_productDetailsItems">{item.title}</Accordion.Header>
                      <Accordion.Body>
                        <div className="_item" id="markdown-container">
                          <ReactMarkdown>{formatRichText(item.content)}</ReactMarkdown>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                );
              })}
            </div>
            <br />
            {productDetials?.paired_products?.length === 0 ? null : (
              <div>
                <h5>Pair With</h5>
                {productDetials?.paired_products?.map((pairProduct, index) => {
                  return (
                    <div key={index}>
                      <PairWith
                        product={pairProduct}
                        // onClick={() => {
                        //   navigate(`/products/${pairProduct?.identifier}`);
                        // }}
                        onClick={() => {
                          navigate(`/products/${pairProduct?.identifier}`);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Col>
        <CartModal cartModal={cartModal} setCartModal={setCartModal} />
        <WishListModal wishListModel={wishListModel} setWishListModel={setWishListModel} />
        <CustomModal open={sizeChartModalOpen} onCloseModal={onCloseModal} showCloseIcon={true}>
          <SizeChart item={productDetials?.size_guide} />
        </CustomModal>

        {!isMobile ? (
          <ProductMobileStories
            open={openStoriesModal}
            productStories={sortedStories}
            handleModalClose={() => {
              handleModalClose();
              setSortedStories([]);
            }}
          // clickedStoryIndex={clickedStoryIndex}
          />
        ) : (
          <ProductStoriesModal
            openStoriesModal={openStoriesModal}
            handleModalClose={() => {
              handleModalClose();
              setSortedStories([]);
            }}
            productStories={sortedStories}
          // clickedStoryIndex={clickedStoryIndex}
          />
        )}
      </>
    </>
  );
}
export default ProductDetail;
