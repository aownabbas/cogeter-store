import React, { useState } from "react";
import { Row } from "react-bootstrap";

import { Col } from "react-bootstrap";
import WishListModal from "./WishListModal";
import CartModal from "./CartModal";

import ProductComponent from "./ProductComponent";

import { _getAllProducts } from "../redux/actions/product";

function InterestedProducts(props) {
  const [wishListModel, setWishListModel] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  return (
    <>
      <div id="interestedProducts">
        <Row>
          {props._allProducts &&
            (props._allProducts ?? []).map((item, index) => {
              return (
                <Col key={index} lg={3} xl={3} sm={6} xs={6}>
                  <ProductComponent item={item} onAddToWishList={() => null} />
                </Col>
              );
            })}
        </Row>
      </div>
      <WishListModal wishListModel={wishListModel} />
      <CartModal cartModal={cartModal} />
    </>
  );
}

export default InterestedProducts;
