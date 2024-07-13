import React, { useCallback, useEffect, useState } from "react";
import SuperMaster from "../layouts/SuperMaster";
import { Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import CartModal from "../components/CartModal";
import { fetchProducts } from "../actions/Products";
import ProductListSlider from "../components/ProductListSlider";
import ProductDetail from "../components/ProductDetail";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  getProductsYouMayInterested,
} from "../https/productsScreenRequests";
import { errorRequestHandel } from "../utils/helperFile";
import ProductDetaillShimer from "../components/shimer/address-shimer/product-detail-shimer/ProductDetaillShimer";
import { moveToTop } from "../helpers/Index";
import { _toggleOverylay } from "../redux/actions/settingsAction";
import { _getSingleProductDetail } from "../redux/actions/product";
function Product() {
  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = params;
  const [productId, setProductID] = useState(id ?? "");

  const [filterModal, setFilterModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productDetials, setProductDetails] = useState({});
  const [ineterestedProducts, setIneterestedProducts] = useState([]);

  useEffect(() => {
    dispatch(_toggleOverylay(false));

    setLoading(true);
    fetchSingleProductDetails();
  }, [params]);

  useEffect(() => {
    fetchInterestedProducts();
  }, []);

  const fetchSingleProductDetails = async () => {
    try {
      const response = await getProductDetails({ productId: params.id });
      if (response.status === 200) {
        let _prodDetails = response.data?.data;
        dispatch(_getSingleProductDetail(response.data?.data))
        _prodDetails?.common_details.sort(
          (a, b) => a.sorting_number - b.sorting_number
        );
        setProductDetails(_prodDetails);
        setLoading(false);
        setMetaTags(_prodDetails);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };
  const fetchInterestedProducts = async () => {
    try {
      // setLoading(true);
      const response = await getProductsYouMayInterested();
      if (response.status === 200) {
        setIneterestedProducts(response.data?.data);
        moveToTop();
        setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  function setMetaTags(meta) {
    const _itemUrl =
      process.env.REACT_APP_WEBSITE_URL + "/products/" + meta.identifier;
    document
      .querySelector('meta[property="og:title"]')
      .setAttribute("content", meta.title);
    document
      .querySelector('meta[property="og:type"]')
      .setAttribute("content", "product");
    document
      .querySelector('meta[property="og:description"]')
      .setAttribute("content", meta.details);
    document
      .querySelector('meta[property="og:image"]')
      .setAttribute("content", meta.cover_image);
    document
      .querySelector('meta[property="og:url"]')
      .setAttribute("content", _itemUrl);
    document
      .querySelector('meta[name="twitter:title"]')
      .setAttribute("content", meta.title);
    document
      .querySelector('meta[name="twitter:description"]')
      .setAttribute("content", meta.details);
    document
      .querySelector('meta[name="twitter:image"]')
      .setAttribute("content", meta.cover_image);
  }

  const selectSimilarProducts = (id) => {
    // setProductDetails({});
    // setProductID(id);
    // navigate(`/products/${id}`);
    // moveToTop();
  };

  const onAddToWishList = (item) => {
    let _oldIneterestedProducts = [...ineterestedProducts];
    const findIndex = _oldIneterestedProducts.findIndex(
      (prod) => prod.id === item.id
    );
    _oldIneterestedProducts[findIndex].is_wishlist =
      !_oldIneterestedProducts[findIndex].is_wishlist;
    setIneterestedProducts(_oldIneterestedProducts);
  };

  return (
    <>
      <SuperMaster>
        {Object.keys(productDetials).length > 0 && productDetials !== null ? (
          <Row id="productsContainer">
            <ProductDetail
              productDetials={productDetials}
              // selectSimilarProducts={selectSimilarProducts}
            />
          </Row>
        ) : (
          <ProductDetaillShimer />
        )}

        <br />
        <br />
        <ProductListSlider
          headerText="YOU MIGHT ALSO LIKE"
          listProducts={ineterestedProducts}
          // selectSimilarProducts={selectSimilarProducts}
          onAddToWishList={onAddToWishList}
        />
      </SuperMaster>
      <CartModal cartModal={cartModal} setCartModal={setCartModal} />
    </>
  );
}

export default Product;
