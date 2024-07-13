import React, { useEffect, useRef, useState } from "react";
import SuperMaster from "../layouts/SuperMaster";
import { Col, Row, Spinner } from "react-bootstrap";
import { json, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUserProfileApi, updateUserProfileApi } from "../https/current-user";
import { errorRequestHandel } from "../utils/helperFile";
import ProfileShimer from "../components/shimer/profile-shimer/ProfileShimer";
import { _getCountriesList } from "../redux/actions/generalActions";

function MyPersonalDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const _countryList = useSelector((state) => state._general.countryList);
  const [loading, setLoading] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    _countryList.length > 0 ? _countryList[0] : null
  ); // Default selected country
  const [userPhoneCode, setUserPhoneCode] = useState("");
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    phone_code: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    phoneNumber: useRef(null),
  };
  const [userEmail, setUserEmail] = useState("");

  const goBack = () => {
    navigate("/profile", { state: { from: "my-personal-detail" } });
  };
  useEffect(() => {
    if (_countryList.length > 0) {
      getCurrentUser();
    }
  }, [_countryList]);
  const getCurrentUser = async () => {
    try {
      setisLoading(true);
      const response = await getUserProfileApi();
      if (response.status === 200) {
        const userData = response.data?.data?.user;

        const foundCountry = _countryList.find(
          (country) => country.phone_code === userData?.phone_code
        );
        if (foundCountry) {
          setSelectedCountry(foundCountry);
        }
        localStorage.setItem("user", JSON.stringify(userData));
        setValues({
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          phone: userData?.phone,
          phone_code: userData?.phone_code ?? "+971",
        });

        setUserEmail(userData?.email);
        setisLoading(false);
      }
    } catch (error) {
      setisLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const onSubmit = () => {
    updateUserProfile(values);
  };

  const updateUserProfile = async (payload) => {
    // let regex = /[a-zA-Z]/;
    if (values.first_name === "" && values.last_name === "" && values.phone === "") {
      setErrors({
        first_name: "This field is required",
        last_name: "This field is required",
        phone: "This field is required",
      });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (values.first_name === "") {
      setErrors({
        ...errors,
        first_name: "This field is required",
      });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (values.last_name === "") {
      setErrors({
        ...errors,
        last_name: "This field is required",
      });
      inputRefs.lastName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (values.phone === "") {
      setErrors({
        ...errors,
        phone: "This field is required",
      });
      inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
      return
    }

    if (payload?.phone.toString().length < selectedCountry?.phone_no_limit) {
      setErrors({
        ...errors,
        phone: "Phone number is too short",
      });
      inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      const response = await updateUserProfileApi(payload);

      if (response.status === 200) {
        toast.success("Information updated");
        setLoading(false);
        // await getCurrentUser();
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    const selectedCountry = _countryList.find(
      (country) => country.phone_code === selectedCountryCode
    );
    setSelectedCountry(selectedCountry);
    setShowDropdown(false); // Close the dropdown after selecting a country
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;

    // Remove any leading zeros
    const cleanedNumber = inputValue.replace(/\D/g, '');
    // let regex = /[a-zA-Z]/;
    console.log(cleanedNumber,"cleanedNumber");
    setPhoneNumber(cleanedNumber);
    // Format the phone number with the country code and cleaned phone number
    // if (regex.test(cleanedNumber)) {
    //   setErrors({
    //     ...errors,
    //     phone: "Enter valid phone number",
    //   });
    // }
     if (cleanedNumber.length < selectedCountry?.phone_no_limit) {
      // setError("Phone number is too short");
      setErrors({
        ...errors,
        phone: "Phone number is too short",
      });
    }
     else {
      // setError("");
      setErrors({
        ...errors,
        phone: "",
      });
    }
    setValues({ ...values, phone: cleanedNumber });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <SuperMaster>
      <div id="MyPersonalDetail">
        <h3>My Personal Details</h3>
        {isLoading ? (
          <ProfileShimer />
        ) : (
          <form>
            <div className="form-group row">
              <div className="col-md-6" ref={inputRefs.firstName}>
                <div className="floating-label">
                  <input
                    type="text"
                    className={`form-control ${errors.first_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                    required
                    placeholder="First Name"
                    value={values?.first_name ?? ""}
                    onChange={(e) =>
                      setValues({ ...values, first_name: e.target.value })
                    }
                    onFocus={() => setErrors({ ...errors, first_name: "" })}
                  />
                </div>
                <div className="text-danger">
                  <span>{errors.first_name}</span>
                </div>
              </div>

              <div className="col-md-6"  ref={inputRefs.lastName}>
                <div className="floating-label">
                  <input
                    type="text"
                    className={`form-control ${errors.last_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                    required
                    placeholder="Last Name"
                    value={values?.last_name ?? ""}
                    onChange={(e) =>
                      setValues({ ...values, last_name: e.target.value })
                    }
                    onFocus={() => setErrors({ ...errors, last_name: "" })}
                  />
                </div>
                <div className="text-danger">
                  <span>{errors.last_name}</span>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-6" ref={inputRefs.phoneNumber}>
                <div className={`${
              errors.phone !== "" && errors.phone !== undefined
                ? "phone-input-container-error"
                : "phone-input-container"
            }`}>
                  <div className="phone-input">
                    <img
                      src={selectedCountry?.icon}
                      alt={`${selectedCountry?.name} Flag`}
                      // width="50"
                      height="20"
                    />
                    <span className="code" onClick={toggleDropdown}>
                      {selectedCountry?.phone_code}
                    </span>
                    {showDropdown && (
                      <div className="dropdown">
                        {_countryList.map((country) => (
                          <div
                            key={country.code}
                            className="dropdown-item"
                            onClick={() => {
                              handleCountryChange({
                                target: { value: country.phone_code },
                              });
                              setValues({
                                ...values,
                                phone_code: country.phone_code,
                              });
                            }}
                          >
                            {country.name} ({country.phone_code})
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="tel"
                      value={values?.phone}
                      onChange={handlePhoneNumberChange}
                      maxLength={selectedCountry?.phone_no_limit}
                      className="form-control phone-number-input"
                      placeholder="Phone Number"
                      id="phone_number-2"
                      onFocus={() => setErrors({ ...errors, phone: "" })}
                    />
                  </div>
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              <div className="col-md-6">
                <div className="floating-label">
                  <input
                    type="text"
                    className={`form-control custom-input `}
                    required
                    placeholder="Email"
                    value={userEmail ?? ""}
                    contentEditable={false}
                    disabled
                    style={{
                      opacity: 0.6, // Ensure the input is visible
                      color: "#000", // Set the text color to black (adjust as needed)
                      /* Add any additional styles here if necessary */
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
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
              <button className="form-control _submit" onClick={onSubmit}>
                {loading ? (
                  <Spinner animation="border" size="sm" role="status" />
                ) : (
                  "Update Personal Information"
                )}
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </SuperMaster>
  );
}
export default MyPersonalDetail;
