import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../https/productsScreenRequests";
import { _getAllProducts } from "../redux/actions/product";
import { errorRequestHandel } from "../utils/helperFile";
import InterestedProducts from "./InterestedProducts";
import WishListModal from "./WishListModal";
import CartModal from "./CartModal";
import PorductListShimer from "./shimer/address-shimer/product-list-shimer/PorductListShimer";
import LoadMoreButton from "./resuable/load-more/LoadMoreButton";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadMoreSpiner from "./resuable/load-more/LoadMoreButton";

function SearchModal() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const _allProducts = useSelector((state) => state._products.products);
  const categoryId = useSelector((state) => state._categories.selectedCategory);

  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);

  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  let debounceTimeout;
  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (search.trim() !== "") {
        fetchAllProducts();
      }
    }, 1000); // Adjust the delay time as needed
  }, [search, page]);

  const fetchAllProducts = async () => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      let categoryIdentifier = categoryId;
      if (
        window.location.pathname.includes("/categories") &&
        (categoryIdentifier === "" ||
          categoryIdentifier === null ||
          categoryIdentifier === undefined)
      ) {
        const currentUrl = new URL(window.location.href);
        const pathParts = currentUrl.pathname.split("/");
        categoryIdentifier = pathParts[pathParts.length - 1];
      }
      setIsLoadingMore(true);
      const response = await getAllProducts({
        categoryId: categoryIdentifier,
        search: search,
        page: page,
        limit: 8,
      });
      if (response.status === 200) {
        if (page === 1) {
          // dispatch(_getAllProducts(response.data.data));
          setSearchData(response.data.data);
          setLoading(false);
        } else {
          // dispatch(_getAllProducts([..._allProducts, ...response.data.data]));
          setSearchData([...searchData, ...response.data.data]);
          setIsLoadingMore(false);
        }
        setTotalRecord(response.data?.meta?.total);
        setLoading(false);
        setIsLoadingMore(false);
      }
    } catch (error) {
      setLoading(false);
      setIsLoadingMore(false);
      errorRequestHandel({ error: error });
    }
  };
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className={`_searchModal _hidden`}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div id="logo">
            <Link to={"/"}>
              <img src={process.env.PUBLIC_URL + "/imgs/logo.svg"} />
            </Link>
            <img
              className="_closeSearchModal"
              src={process.env.PUBLIC_URL + "/imgs/close.svg"}
              onClick={() => {
                setSearch("");
                setSearchData([]);
                setTotalRecord(0);
              }}
            />
          </div>

          <div className="_searchInputOnSearchPage">
            <div className="mb-3 _queryInput form-group" htmlFor="query">
              <div className="icon">
                <img src={process.env.PUBLIC_URL + "/imgs/search.svg"} />
              </div>
              <input
                className="_inputWithIcon form-control"
                type="text"
                placeholder="Search what you are looking for"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onKeyDown={searchProductsOnQuery}
              />
            </div>
            {searchData?.length === 0 && !isLoadingMore && search !== "" && (
              <div className="_notFoundText">
                <p>Product not found</p>
              </div>
            )}
          </div>
          <div className="_popularSearches">
            {search.trim().length > 0 && loading ? (
              <PorductListShimer />
            ) : (
              <InfiniteScroll
                style={{ overflow: "hidden" }}
                dataLength={searchData?.length}
                next={loadMore}
                hasMore={searchData?.length !== totalRecord ? true : false}
                loader={
                  searchData?.length === totalRecord ? null : <LoadMoreSpiner />
                }
              >
                <InterestedProducts
                  headerText=""
                  // setFilterModal={setFilterModal}
                  _allProducts={searchData}
                />
              </InfiniteScroll>
            )}
            {/* <InterestedProducts
              headerText=""
              // setFilterModal={setFilterModal}
              _allProducts={searchData}
            /> */}
          </div>
        </form>

        <br />
        <br />
      </div>
      <WishListModal />
      <CartModal />
    </>
  );
}
export default SearchModal;
