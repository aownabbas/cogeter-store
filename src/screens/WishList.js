import React, { useEffect, useState } from "react";
import SuperMaster from "../layouts/SuperMaster";
import WishListProducts from "../components/WishListProducts";
import { getAllWishlistProducts } from "../https/wishlistRequests";
import { errorRequestHandel } from "../utils/helperFile";
import LoadMoreSpiner from "../components/resuable/load-more/LoadMoreButton";

import InfiniteScroll from "react-infinite-scroll-component";
import NoDataFound from "../components/resuable/no-data-found/NoDataFound";
import noItemFound from "../assets/no-data/no_wishlist_item.svg";

function Wishlist() {
  const [filterModal, setFilterModal] = useState(false);
  const openFilterModal = () => {
    setFilterModal(true);
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    fetchAllWishListProducts();
  }, [page]);

  const removeItemFromWishlist = (id) => {
    let _newData = data.filter((item) => item.id !== id);
    setData(_newData);
  };
  const fetchAllWishListProducts = async () => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      setIsLoadingMore(true);
      const response = await getAllWishlistProducts({ limit: 8, page: page });
      if (response.status === 200) {
        let formattedData = response.data?.data?.map((item) => {
          return {
            ...item,
            is_wishlist: true,
          };
        });
        if (page === 1) {
          setData(formattedData);
          setLoading(false);
        } else {
          setTimeout(() => {
            setData([...data, ...formattedData]);
            setIsLoadingMore(false);
          }, 1000);
        }
        setTotalRecord(response.data?.meta?.total);
        setIsLoadingMore(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setIsLoadingMore(false);
      errorRequestHandel({ error: error });
    }
  };

  const loadMore = () => {
    setPage((pre) => pre + 1);
  };
  return (
    <SuperMaster>
      {data.length === 0 ? (
        <NoDataFound
          icon={noItemFound}
          title={"No favourites added yet"}
          subTitle={"Begin the process by clicking the heart icon on products."}
        />
      ) : (
        <InfiniteScroll
          style={{ overflow: "hidden" }}
          dataLength={data.length}
          next={loadMore}
          hasMore={true}
          loader={data.length === totalRecord ? null : <LoadMoreSpiner />}
        >
          <WishListProducts
            headerText=""
            setFilterModal={setFilterModal}
            data={data}
            removeItemFromWishlist={removeItemFromWishlist}
          />
        </InfiniteScroll>
      )}
    </SuperMaster>
  );
}

export default Wishlist;
