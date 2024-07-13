import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { Col } from "react-bootstrap";
import Slider from "react-slick";
import WishListModal from "./WishListModal";
import CartModal from "./CartModal";

import { useDispatch } from "react-redux";

import ProductComponent from "./ProductComponent";

function ProductListSlider(props) {
  const dispatch = useDispatch();

  const [wishListModel, setWishListModel] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState();
  const showOnMobile = window.innerWidth < 769;
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: showOnMobile ? 1 : 4,
    slidesToScroll: 1,
    loop: true,
    arrows: true,
    // autoplay: true,
  };

  const listAllProducts = () => {
    return (
      props.listProducts &&
      (props.listProducts ?? []).map((product, index) => {
        return (
          <Col key={index} lg={3} xl={3} sm={6}>
            <ProductComponent
              item={product}
              // selectSimilarProducts={props.selectSimilarProducts}
              onAddToWishList={props.onAddToWishList}
            />
          </Col>
        );
      })
    );
  };
  return (
    <>
      <div id="interestedProducts">
        <h4 style={{ paddingLeft: 5 }}>{props.headerText}</h4>
        <Row>
          {props.listProducts && props.listProducts?.length > 4 ? (
            <Slider {...settings}>{listAllProducts()}</Slider>
          ) : (
            <>{listAllProducts()}</>
          )}
        </Row>
      </div>
      <WishListModal
        wishListModel={wishListModel}
        setWishListModel={setWishListModel}
      />
      <CartModal cartModal={cartModal} setCartModal={setCartModal} />
    </>
  );
}

export default ProductListSlider;
