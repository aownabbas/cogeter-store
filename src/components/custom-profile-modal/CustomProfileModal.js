import React, { useEffect, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { _toggleOverylay } from '../../redux/actions/settingsAction';
import PhoneNumberInput from '../resuable/phone-input/PhoneNumberInput';
import { Button, Form } from 'react-bootstrap';
import { onAccountSetup } from '../../https/authentication';
import { _accountSetup, _login } from '../../redux/actions/authentication';
import { errorRequestHandel, isValidEmailAddress } from '../../utils/helperFile';

const CustomProfileModal = () => {
  const userInformation = useSelector((state) => state._auth.user);
  const [isExistingEmailValid, setIsExistingEmailValid] = useState(true);
  console.log(isExistingEmailValid, 'emailvalid');
  const state = useSelector((state) => state);
  const [isUserHasMobileNumber, setIsUserHasMobileNumber] = useState(false);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    email: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      userInformation &&
      (userInformation?.phone === '' ||
        userInformation?.phone === null ||
        userInformation?.phone_code === '' ||
        userInformation?.phone_code === null)
    ) {
      dispatch(_toggleOverylay(true));
      setIsUserHasMobileNumber(true);
      setIsExistingEmailValid(isValidEmailAddress(userInformation.email));
    }
  }, [userInformation]);

  const onUpdate = async () => {
    try {
      if (phone === '') {
        setErrors({
          ...errors,
          phone: 'This field is required',
        });
        return;
      }

      if (!isExistingEmailValid) {
        if (email === '') {
          setErrors({
            ...errors,
            email: 'This field is required',
          });
          return;
        }
        if (!isValidEmailAddress(email)) {
          setErrors({
            ...errors,
            email: 'Email address is not valid',
          });
          return;
        }
      }

      let paylaod = {
        phone: phone,
        phone_code: phoneCode,
      };

      if (!isExistingEmailValid) {
        paylaod['email'] = email;
        paylaod['username'] = email;
      }

      const response = await onAccountSetup(paylaod);
      if (response.status === 200) {
        // dispatch(_accountSetup(response.data.data.user));
        dispatch(_login(response.data.data));
        setIsUserHasMobileNumber(false);
        dispatch(_toggleOverylay(false));
      } else {
      }
    } catch (error) {
      // if (error.response.status == 400) {
      //   if (error.response.data.message == 'This email is already taken') {
      //     setErrors({
      //       ...errors,
      //       email: 'This email is already taken',
      //     });
      //   }
      // }
      errorRequestHandel({ error: error });
    }
  };
  return (
    <div className={`__cart_modal__container ${!isUserHasMobileNumber ? '_hidden' : '_flex'}`}>
      <div className="custom_profile_modal__container">
        <form>
          <div className="custom_profile_modal__header">
            <p>Quick Steps to Complete Your Checkout!</p>
            {isExistingEmailValid !== true ? (
              <span>
                For a seamless and secure checkout experience, kindly enter both your mobile number and email address.
              </span>
            ) : (
              <span>To ensure a secure and smooth checkout, please provide your mobile number.</span>
            )}
          </div>
          <div className="custom_profile_modal__phone_field">
            <PhoneNumberInput
              onChange={(e) => setPhone(e)}
              onPhoneCode={(code) => setPhoneCode(code)}
              isFromPayment={false}
              key={'1'}
              onEmptyPhone={errors.phone}
              setErrors={setErrors}
              errors={errors}
            />
          </div>
          {!isExistingEmailValid && (
            <div className="form-group row">
              <div className="col-md-12">
                <div className="floating-label">
                  <input
                    type="email"
                    className="form-control custom-input"
                    id="email-1"
                    required
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setErrors({ ...errors, email: '' })}
                  />
                </div>
              </div>
              <div className="text-danger">
                <span>{errors?.email}</span>
              </div>
            </div>
          )}
          <div className="text-danger">
            <span>{errors.password}</span>
          </div>

          <Form.Group className="mb-3  _btnContainer">
            <Button variant="primary" className="_btnFlatCenter" onClick={onUpdate}>
              Update
            </Button>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default CustomProfileModal;
