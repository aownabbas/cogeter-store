import React, { useEffect, useState } from "react";
import SuperMaster from "../layouts/SuperMaster";
import InterestedProducts from "../components/InterestedProducts";
import FilterModal from "../components/FilterModal";
import Shimer from "../components/shimer/Shimer";
import ShimmerEffect from "../components/shimer/Shimer";
import FilterIcon from "../assets/icons/filter-icon.svg";
import Categories from "../components/Categories";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../https/productsScreenRequests";
import { _getAllProducts } from "../redux/actions/product";
import { errorRequestHandel } from "../utils/helperFile";
import { useLocation } from "react-router-dom";
import { _setSelectedCategory } from "../redux/actions/category";
import AddressShimer from "../components/shimer/address-shimer/AddressShimer";
import PorductListShimer from "../components/shimer/address-shimer/product-list-shimer/PorductListShimer";
import NoDataFound from "../components/resuable/no-data-found/NoDataFound";
import LoadMoreButton from "../components/resuable/load-more/LoadMoreButton";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadMoreSpiner from "../components/resuable/load-more/LoadMoreButton";
import { _toggleOverylay } from "../redux/actions/settingsAction";
import { useNavigate } from "react-router-dom";
import endPoints from "../https/endPoints";


function ProductInCategory(props) {
  const [filterModal, setFilterModal] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = useSelector((state) => state._categories.selectedCategory);

  const _allProducts = useSelector((state) => state._products.products);
  console.log(_allProducts,"allproducts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // filters

  const [color, setColor] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [size, setSize] = useState("");


  const openFilterModal = () => {
    setFilterModal(true);
    dispatch(_toggleOverylay(true));
  };

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    fetchAllProducts();
  }, [categoryId, color, sortBy, size, page, location]);


  const fetchAllProducts = async () => {
    let categoryIdentifier = categoryId;
    if (categoryIdentifier === "" || categoryIdentifier === null || categoryIdentifier === undefined) {
      const currentUrl = new URL(window.location.href);
      const pathParts = currentUrl.pathname.split('/');
      categoryIdentifier = pathParts[pathParts.length - 1];
    }
    if (page === 1) {
      setLoading(true);
    }
    try {
      setIsLoadingMore(true);
      const response = await getAllProducts({
        categoryId: categoryIdentifier,
        size,
        color,
        sort: sortBy,
        limit: 8,
        page: page,
      });

      if (response.status === 200) {
        if (page === 1) {
          dispatch(_getAllProducts(response.data.data));
          setLoading(false);
        } else {
          dispatch(_getAllProducts([..._allProducts, ...response.data.data]));
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

  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  const onSelectColor = (_color) => {
    setColor(_color);
    setPage(1);
  };
  const onSelectSize = (_size) => {
    setSize(_size);
    setPage(1);
  };
  const onSelectSortBy = (_sortBy) => {
    setSortBy(_sortBy);
    setPage(1);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <SuperMaster>
      <Categories handelClickOnCategory={handelClickOnCategory} />
      <div
        className="_filters text-right _cursorPointer clearFix"
        onClick={openFilterModal}
      >
        <img src={FilterIcon} alt="filter" /> FILTERS
      </div>
      <br clear="all" />
      {loading ? (
        <PorductListShimer />
      ) : _allProducts?.length === 0 || _allProducts === undefined ? (
        <NoDataFound title={"No Products Found"} />
      ) : (
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={_allProducts?.length}
          next={loadMore}
          hasMore={_allProducts.length !== totalRecord ? true : false}
          loader={
            _allProducts.length === totalRecord ? null : <LoadMoreSpiner />
          }
        >
          <InterestedProducts
            headerText=""
            setFilterModal={setFilterModal}
            _allProducts={_allProducts}
          />
        </InfiniteScroll>
      )}

      <FilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
        onSelectColor={onSelectColor}
        onSelectSize={onSelectSize}
        onSelectSortBy={onSelectSortBy}
      />
    </SuperMaster>
  );
}

export default ProductInCategory;
