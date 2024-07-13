import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatOrder } from "../../../helpers/Index";
import NoDataFound from "../../../components/common-components/no-data-found";
import { constRoute } from "../../../utils/const";
import { getOrdersList } from "../../../https/ordersRequests";
import SuperMaster from "../../../layouts/SuperMaster";
import { convertToTitleCase, errorRequestHandel } from "../../..//utils/helperFile";
import CustomText from "../../common-components/Custom-Text";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import AddressShimer from "../../shimer/address-shimer/AddressShimer";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadMoreSpiner from "../../resuable/load-more/LoadMoreButton";

function OrderItems() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 770px)").matches
  );
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 770px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const [_data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    fetchOrdersList();
  }, [page]);

  const fetchOrdersList = async () => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      setIsLoadingMore(true);
      const response = await getOrdersList({ limit: 10, page: page });
      if (response.status === 200) {
        if (page == 1) {
          setData(response.data.data);
          setLoading(false);
        } else {
          setData([..._data, ...response.data.data]);
          setLoading(false);
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
    setPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <SuperMaster>
        <AddressShimer />
      </SuperMaster>
    );
  }

  return (
    <>
      <InfiniteScroll
        dataLength={_data.length}
        next={loadMore}
        hasMore={true}
        loader={_data.length === totalRecord ? null : <LoadMoreSpiner />}
      >
        <div>
          {(_data?.length &&
            _data?.map((item, index) => {
              return (
                <div className="_item" key={index}>
                  <div className="_body">
                    <div className="_column1">
                      <div className="_text">
                        {/* <p>{index + 1}</p> */}
                        <p>{formatOrder(item.order_date)}</p>
                        <h3 className="mt-1">Order Number # {item.order_no}</h3>
                        {!matches ? (
                          <div>
                            <div className={style.orderStatusAddress}>
                              <div>
                                <CustomText
                                  title={`Order Status: ${convertToTitleCase(item?.status ?? "Pending")
                                    }`}
                                />
                              </div>
                            </div>
                            <div className={style.orderStatusAddress}>
                              <div style={{ marginTop: "5px" }}>
                                <CustomText
                                  className={style.paymentStatus}
                                  title={`${item?.address?.address_line_1 || ""
                                    } ${item?.address?.address_line_2 || ""} ${item?.address?.city || ""
                                    }`}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className={style.orderStatusAddress}>
                              <div>
                                <CustomText
                                  title={`Order Status: ${item?.status ?? "Pending"
                                    }`}
                                // title={`Order Status: ${item?.status ?? "Pending"
                                //   }`}
                                />
                              </div>
                            </div>
                            {/* <div className={style.orderStatusAddress}>
                              <div>
                                <CustomText
                                  className={style.paymentStatus}
                                  title={`${item?.address?.address_line_1 || ""}`}
                                />
                              </div>
                            </div> */}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="_column2">
                      <div className="_text">
                        <h3>
                          {item?.currency} {item?.amount}
                        </h3>
                        <Link
                          to={`/orders/details/${item?.identifier}`}
                          state={item}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })) || <NoDataFound />}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default OrderItems;
