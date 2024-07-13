import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import WishListModal from "./WishListModal";
import CartModal from "./CartModal";
import { useDispatch, useSelector } from "react-redux";

import ProductComponent from "./ProductComponent";

function WishListProducts(props) {
  const [wishListModel, setWishListModel] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");

  const wishlistProducts = useSelector((state) => state._products.wishlists);
  const dispatch = useDispatch();

  const listAllProducts = () => {
    return (
      <>
        {props.data?.length > 0 &&
          (props.data ?? []).map((item, index) => {
            return (
              <Col key={index} lg={3} xl={3} sm={6} xs={6}>
                <ProductComponent
                  item={item}
                  removeItemFromWishlist={props.removeItemFromWishlist}
                  onAddToWishList={() => null}
                />
              </Col>
            );
          })}
      </>
    );
  };

  return (
    <>
      <div id="interestedProducts">
        <h4>{props.headerText}</h4>
        <Row>{listAllProducts()}</Row>
      </div>
      <WishListModal
        wishListModel={wishListModel}
        setWishListModel={setWishListModel}
      />
      <CartModal cartModal={cartModal} setCartModal={setCartModal} />
    </>
  );
}

export default WishListProducts;
