import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import smalDownArrow from '../assets/checkout/arrow-down.svg';

import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, getAddressesList, updateAddress } from '../https/addressesRequests';
import { errorRequestHandel } from '../utils/helperFile';
import { _addNewAddress, _getAllAddresses, _updateAddress } from '../redux/actions/addresses';
import { _toggleOverylay } from '../redux/actions/settingsAction';
import CloseIcon from '../assets/icons/close-circle.svg';

function ChangeAddressModal(props) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);
  const _singleAddress = useSelector((state) => state._addresses.singleAddress);
  const _countryList = useSelector((state) => state._general.countryList);

  const [values, setValues] = useState({
    country: _singleAddress?.country || '', // Check this line
    city: _singleAddress?.city || '',
    state: _singleAddress?.state || '',
    addressLine1: _singleAddress?.address_line_1 || '',
    addressLine2: _singleAddress?.address_line_2 || '',
    mobileNumber: _singleAddress?.phone || '',
  });

  useEffect(() => {
    // Update the state when _singleAddress changes
    setValues({
      country: _singleAddress?.country || '',
      city: _singleAddress?.city || '',
      state: _singleAddress?.state || '',
      addressLine1: _singleAddress?.address_line_1 || '',
      addressLine2: _singleAddress?.address_line_2 || '',
      mobileNumber: _singleAddress?.phone || '',
    });
  }, [_singleAddress]);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const fetchAddressesList = async () => {
    try {
      const response = await getAddressesList({ limit: 10, page: 1 });
      if (response.status === 200) {
        dispatch(_getAllAddresses(response.data?.data));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      //  errorRequestHandel({ error: error });
    }
  };

  const [errors, setErrors] = useState({
    country: '',
    city: '',
    state: '',
    addressLine1: '',
  });

  const inputRefs = {
    country: useRef(null),
    city: useRef(null),
    state: useRef(null),
    addressLine1: useRef(null),
  };

  const handelUpdateAddress = async () => {
    if (values.city === '' && values.state === '' && values.addressLine1 === '') {
      setErrors({
        city: 'This field is required',
        state: 'This field is required',
        addressLine1: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.city === '') {
      setErrors({
        ...errors,
        city: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.state === '') {
      setErrors({
        ...errors,
        state: 'This field is required',
      });
      inputRefs.state.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.addressLine1 === '') {
      setErrors({
        ...errors,
        addressLine1: 'This field is required',
      });
      inputRefs.addressLine1.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    try {
      const data = {
        latitude: '0',
        longitude: '0',
        address_line_1: values.addressLine1,
        address_line_2: values.addressLine2,
        city: values.city,
        country: values.country?.id,
        state: values.state,
        phone: values.mobileNumber,
      };

      setLoading(true);
      const response = await updateAddress({
        data: data,
        id: _singleAddress?.id,
      });
      if (response.status === 200) {
        props.onClose();
        dispatch(_updateAddress(values?.addressLine1, _singleAddress?.id));
        toast.success('Address updated');
        setLoading(false);
        dispatch(_toggleOverylay(false));
        fetchAddressesList();
      }
    } catch (error) {
      setLoading(false);

      errorRequestHandel({ error: error });
    }
  };

  const handleAddNewAddress = async () => {

    if (values.country === '' && values.city === '' && values.state === '' && values.addressLine1 === '') {
      setErrors({
        country: 'This field is required',
        city: 'This field is required',
        state: 'This field is required',
        addressLine1: 'This field is required',
      });
      inputRefs.country.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.country === '') {
      setErrors({
        ...errors,
        country: 'This field is required',
      });
      inputRefs.country.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.city === '') {
      setErrors({
        ...errors,
        city: 'This field is required',
      });
      inputRefs.city.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.state === '') {
      setErrors({
        ...errors,
        state: 'This field is required',
      });
      inputRefs.state.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }
    if (values.addressLine1 === '') {
      setErrors({
        ...errors,
        addressLine1: 'This field is required',
      });
      inputRefs.addressLine1.current.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
      return;
    }

    try {
      const data = {
        latitude: '0',
        longitude: '0',
        address_line_1: values.addressLine1,
        address_line_2: values.addressLine2,
        city: values.city,
        country: values.country?.id,
        state: values.state,
        phone: values.mobileNumber,
      };
      setLoading(true);
      const response = await addNewAddress({ data: data });
      if (response.status === 200) {
        dispatch(_addNewAddress(response.data.data));
        toast.success('Address added');
        setLoading(false);
        dispatch(_toggleOverylay(false));
        props.onClose();
        // toggleAddressModal();
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };
  return (
    <>
      <div id="registrationModal" className={props.addressModal ? 'fadeIn' : 'fadeOut'}>
        <div className="address_modal__container">
          <div className="address_modal__header">
            <div>
              <h4>Change Address</h4>
            </div>
            {/* <div className="_close _closeAddressModal" onClick={props.onClose}>
              <span className="fa fa-close"></span>
            </div> */}
            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  props.onClose();
                  setErrors({
                    country: '',
                    city: '',
                    state: '',
                    addressLine1: '',
                  });
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.country}>
              <div className={`${errors.country !== '' ? 'address_modal__dropdwon_error_container' : 'address_modal__dropdwon_container'}`} onClick={toggleExpand}>
                <span>{values?.country ? values?.country?.name : 'Country'}</span>
                <img
                  src={smalDownArrow}
                  alt="Expand/Collapse Icon"
                  className={`arrow-icon ${expand ? 'expanded' : ''}`}
                />
              </div>
              <div className="text-danger mt-1">
                <span>{errors.country}</span>
              </div>
              <div className={`dropdown-content ${expand ? 'expand' : ''}`}>
                {(_countryList ?? []).map((country, index) => (
                  <div
                    key={index}
                    className="country-option"
                    onClick={() => {
                      toggleExpand();
                      setValues({ ...values, country: country });
                      setErrors({ ...errors, country: '' })
                    }}
                  >
                    {country.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-12" ref={inputRefs.city}>
              <div className="floating-label">
                <input
                  type="text"
                  // className="form-control custom-input"
                  className={`form-control ${errors.city !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="city"
                  required
                  placeholder="City"
                  value={values.city ?? ''}
                  onChange={(e) => setValues({ ...values, city: e.target.value })}
                  onFocus={() => setErrors({ ...errors, city: '' })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.city}</span>
              </div>
            </div>
            <div className="col-md-12" ref={inputRefs.state}>
              <div className="floating-label">
                <input
                  type="text"
                  className={`form-control ${errors.state !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="state"
                  name="state"
                  required
                  placeholder="State"
                  value={values.state ?? ''}
                  onChange={(e) => setValues({ ...values, state: e.target.value })}
                  onFocus={() => setErrors({ ...errors, state: '' })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.state}</span>
              </div>
            </div>
            <div className="col-md-12" ref={inputRefs.addressLine1}>
              <div className="floating-label">
                <input
                  type="text"
                  className={`form-control ${errors.addressLine1 !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="addressline"
                  required
                  placeholder="Address line 1"
                  value={values.addressLine1 ?? ''}
                  onChange={(e) => setValues({ ...values, addressLine1: e.target.value })}
                  onFocus={() => setErrors({ ...errors, addressLine1: '' })}
                />
              </div>
              <div className="text-danger">
                <span>{errors.addressLine1}</span>
              </div>
            </div>
            <div className="col-md-12">
              <div className="floating-label">
                <input
                  type="text"
                  className="form-control custom-input"
                  id="addressline"
                  required
                  placeholder="Address line 2"
                  value={values.addressLine2 ?? ''}
                  onChange={(e) => setValues({ ...values, addressLine2: e.target.value })}
                />
              </div>
            </div>
            {/* <div className="col-md-12">
              <div className="floating-label">
                <input
                  type="text"
                  className="form-control custom-input"
                  id="mobile-number-1"
                  required
                  placeholder="Mobile Number (Optional)"
                  value={values.mobileNumber ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, mobileNumber: e.target.value })
                  }
                />
              </div>
            </div> */}

            {Object.keys(_singleAddress).length > 0 ? (
              <Form.Group className="mb-3 _btnContainer">
                <Button onClick={handelUpdateAddress} variant="primary" className="_btnFlatCenter">
                  {loading ? (
                    <div class="spinner-border" role="status" style={{ color: 'white' }}>
                      <span className="sr-only"></span>
                    </div>
                  ) : (
                    'Update'
                  )}
                </Button>
              </Form.Group>
            ) : (
              <Form.Group className="mb-3 _btnContainer">
                <Button onClick={handleAddNewAddress} variant="primary" className="_btnFlatCenter">
                  {loading ? (
                    <div class="spinner-border" role="status" style={{ color: 'white' }}>
                      <span className="sr-only"></span>
                    </div>
                  ) : (
                    'Add New Address'
                  )}
                </Button>
              </Form.Group>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeAddressModal;
