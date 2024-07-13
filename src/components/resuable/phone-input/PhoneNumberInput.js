import React, { useEffect, useState } from 'react';
import './style.css'; // Import your CSS file for styling
import { useSelector } from 'react-redux';

function PhoneNumberInput({ onChange, onPhoneCode, isFromPayment = false, onEmptyPhone,setErrors,errors }) {
  const _selectedCountry = useSelector((state) => state._settings.selectedCountry);
  const _countryList = useSelector((state) => state._general.countryList);
  const _isPhoneNumberSet = useSelector((state) => state._general.isPhoneNumberSet);
  const isLoginModal = useSelector((state) => state._settings.isLoginModal);

  const [selectedCountry, setSelectedCountry] = useState(_countryList[0]); // Default selected country
  const [showDropdown, setShowDropdown] = useState(false);
  // const [error, setError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');


  useEffect(() => {
    if (!isFromPayment) {
      if (_selectedCountry && _selectedCountry.code) {
        const foundCountry = _countryList.find((country) => country.code === _selectedCountry.code);

        if (foundCountry) {
          setSelectedCountry(foundCountry);
          onPhoneCode(foundCountry.phone_code);
        } else {
          setSelectedCountry(_countryList[0]);
          onPhoneCode(_countryList[0]?.phone_code);
        }
      }
    }
    // setError(onEmptyPhone)
    setErrors({
      ...errors,
      phone: onEmptyPhone,
    });
  }, [isLoginModal, _selectedCountry, onEmptyPhone]);

  const handleCountryChange = (event) => {
    const selectedCountryCode = event.target.value;
    const selectedCountry = _countryList.find((country) => country?.phone_code === selectedCountryCode);

    setSelectedCountry(selectedCountry);
    setShowDropdown(false); // Close the dropdown after selecting a country
    onPhoneCode(selectedCountry.phone_code);
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;

    // Remove any leading zeros
    // const cleanedNumber = inputValue.replace(/^0+/, '');
    const cleanedNumber = inputValue.replace(/\D/g, '');

    setPhoneNumber(cleanedNumber);
    const selectedCountryPhoneCode = selectedCountry?.phone_code.replace('+', ''); // Remove any existing + sign
    // Format the phone number with the country code and cleaned phone number
    const formattedNumber = `+${selectedCountryPhoneCode}${cleanedNumber}`;
    let regex = /[a-zA-Z]/; // This pattern checks for any alphabets.

    if(cleanedNumber.length==0){
      // setError('This field is required');
      setErrors({
        ...errors,
        phone: "This field is required",
      });
    }
    else if (cleanedNumber.length < selectedCountry?.phone_no_limit) {
      // setError('Phone number is too short');
      setErrors({
        ...errors,
        phone: "Phone number is too short",
      });
    } else if (regex.test(cleanedNumber)) {
      // setError('Phone number is invalid');
      setErrors({
        ...errors,
        phone: "Enter valid phone number",
      });
    }
    else {
      // setError('');
      setErrors({
        ...errors,
        phone: "",
      });
    }
    onChange(cleanedNumber);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div 
      // className="phone-input-container" 
      className={`${
              errors.phone !== "" && errors.phone !== undefined
                ? "phone-input-container-error"
                : "phone-input-container"
            }`}
      >
        <div className="phone-input">
          <img src={selectedCountry?.icon} alt={`${selectedCountry?.name} Flag`} width="30" height="20" />
          <span className="code" onClick={toggleDropdown}>
            {selectedCountry?.phone_code}
          </span>
          {showDropdown && (
            <div className="dropdown">
              {_countryList?.map((country, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => {
                    handleCountryChange({
                      target: { value: country.phone_code },
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
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            maxLength={selectedCountry?.phone_no_limit}
            className="form-control phone-number-input"
            placeholder="Phone Number"
            id="phone_number-4"
            onFocus={() => setErrors({ ...errors, phone: "" })}
          />
        </div>
      </div>
      {errors.phone && <span className="error-message">{errors.phone}</span>}
    </>
  );
}

export default PhoneNumberInput;
