import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import SuperMaster from "../layouts/SuperMaster";
import { useDispatch, useSelector } from "react-redux";
import CartModal from "../components/CartModal";
import ProductComponent from "../components/ProductComponent";
import { getAllProducts } from "../https/productsScreenRequests";
import { errorRequestHandel } from "../utils/helperFile";
import { _getAllProducts } from "../redux/actions/product";
import WishListModal from "../components/WishListModal";
function Search(props) {
  const [wishListModel, setWishListModel] = useState(false);
  const [cartModal, setCartModal] = useState(false);

  const _allProducts = useSelector((state) => state._products.products);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts({ categoryId: "" });
      if (response.status === 200) {
        dispatch(_getAllProducts(response.data.data));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  return (
    <div className="_searchContent">
      <SuperMaster>
        <div id="interestedProducts" className="_searchPageProducts">
          <Row>
            {_allProducts &&
              (_allProducts ?? [])?.map((item, index) => {
                return (
                  <Col key={index} lg={3} xl={3} sm={6}>
                    <ProductComponent item={item} />
                  </Col>
                );
              })}
          </Row>
        </div>
      </SuperMaster>
      <WishListModal
        wishListModel={wishListModel}
        setWishListModel={setWishListModel}
      />
      <CartModal cartModal={cartModal} setCartModal={setCartModal} />
    </div>
  );
}

export default Search;
