import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChangeAddressModal from "./ChangeAddressModal";
import { Col, Row } from "react-bootstrap";
import { errorRequestHandel } from "../utils/helperFile";
import { getAddressesList } from "../https/addressesRequests";
import Address from "./Address";
import addressIcon from "../assets/address-icon.svg";
import AddressShimer from "./shimer/address-shimer/AddressShimer";
import SingleAddressItem from "./address-related/SingleAddressItem";
import { useDispatch, useSelector } from "react-redux";
import {
  _clearAddressObject,
  _deleteAddress,
  _getAllAddresses,
  _selectAddress,
} from "../redux/actions/addresses";
import { _toggleOverylay } from "../redux/actions/settingsAction";

import InfiniteScroll from "react-infinite-scroll-component";
import LoadMoreButton from "./resuable/load-more/LoadMoreButton";
import LoadMoreSpiner from "./resuable/load-more/LoadMoreButton";

function AddressItem(props) {
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [addressModal, setAddressModal] = useState(false);
  const _allAddresses = useSelector((state) => state._addresses.addresses);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAddressesList();
  }, [page]);

  const fetchAddressesList = async () => {
    try {
      if (page === 1) {
        setLoading(true);
      }
      setIsLoadingMore(true);
      const response = await getAddressesList({ limit: 10, page: page });
      if (response.status === 200) {
        if (page === 1) {
          dispatch(_getAllAddresses(response.data?.data));
          setLoading(false);
        } else {
          setTimeout(() => {
            dispatch(
              _getAllAddresses([..._allAddresses, ...response.data?.data])
            );
            setIsLoadingMore(false);
          }, 1000);
        }
        setTotalRecord(response.data?.meta?.total);
        setLoading(false);
        setIsLoadingMore(false);
      }
    } catch (error) {
      setLoading(false);
      setIsLoadingMore(false);
      errorRequestHandel
        ({ error: error });
    }
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/profile", { state: { from: "my-addresses" } });
  };

  const toggleAddressModal = (e) => {
    setAddressModal(!addressModal);
  };

  const handleClickOnChangeAddress = (data) => {
    dispatch(_selectAddress(data));
    dispatch(_toggleOverylay(true));
    setAddressModal(true);
  };

  const handleClickOnDeleteAddress = (id) => {
    dispatch(_deleteAddress(id));
  };
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      {loading ? (
        <AddressShimer />
      ) : (
        <div>
          <div>
            <InfiniteScroll
              dataLength={_allAddresses.length}
              next={loadMore}
              hasMore={true}
              loader={
                _allAddresses.length === totalRecord ? null : <LoadMoreSpiner />
              }
            >
              {_allAddresses &&
                (_allAddresses ?? [])?.map((address, index) => (
                  <div key={index}>
                    <SingleAddressItem
                      item={address}
                      onClick={() => handleClickOnChangeAddress(address)}
                    // onDelete={() => handleClickOnDeleteAddress(address?.id)}
                    />
                    <div className="hrow" />
                  </div>
                ))}
            </InfiniteScroll>
          </div>

          <Row>
            <Col xl={6} lg={6} sm={12}>
              <div className="form-group">
                <button onClick={goBack} type="button" className="form-control">
                  Go Back
                </button>
              </div>
            </Col>
            <Col xl={6} lg={6} sm={12}>
              <div className="form-group">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(_clearAddressObject());
                    dispatch(_toggleOverylay(true));
                    toggleAddressModal();
                  }}
                  className="form-control _submit"
                >
                  Add New Address
                </button>
              </div>
            </Col>
          </Row>

          <ChangeAddressModal
            onClose={() => {
              dispatch(_toggleOverylay(false));
              setAddressModal(false);
            }}
            addressModal={addressModal}
          />
        </div>
      )}
    </>
  );
}
export default AddressItem;
