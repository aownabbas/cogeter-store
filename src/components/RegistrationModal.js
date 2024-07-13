import React, { useRef, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';
import UseOnClickOutside from './useOnClickOutside';
import { useDispatch } from 'react-redux';
import CloseIcon from '../assets/icons/close-circle.svg';
import { _toggleLoginModal, _toggleOverylay } from '../redux/actions/settingsAction';
import { userRegister } from '../https/authentication';
import { _register } from '../redux/actions/authentication';
import { errorRequestHandel, isValidEmailAddress } from '../utils/helperFile';
import PhoneNumberInput from './resuable/phone-input/PhoneNumberInput';

function RegistrationModal({ registrationModal, setRegistrationModal }) {
  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    phone_code: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
  });

  UseOnClickOutside(ref, () => setRegistrationModal(false));

  const openLoginModal = () => {
    setRegistrationModal(false);
    dispatch(_toggleLoginModal(true));
  };
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    phoneNumber: useRef(null),
    password: useRef(null),
  };

  const onSubmit = async () => {
    const updatedValues = { ...values };
    updatedValues.username = updatedValues.email.trim();
    const { first_name, last_name, email, phone, password } = values;
    const isEmailValid = isValidEmailAddress(email);
    if (first_name === '' && last_name === '' && email === '' && phone === '' && password === '') {
      setErrors({
        first_name: 'This field is required',
        last_name: 'This field is required',
        email: 'This field is required',
        phone: 'This field is required',
        password: 'This field is required',
      });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (first_name === '') {
      setErrors({
        ...errors,
        first_name: 'This field is required',
      });
      inputRefs.firstName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (last_name === '') {
      setErrors({
        ...errors,
        last_name: 'This field is required',
      });
      inputRefs.lastName.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (email === '') {
      setErrors({
        ...errors,
        email: 'This field is required',
      });
      inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
      return;
    } else if (!isEmailValid) {
      setErrors({
        ...errors,
        email: 'Email address is not valid',
      });
      inputRefs.email.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (phone === '') {
      setErrors({
        ...errors,
        phone: 'This field is required',
      });
      inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (errors.phone !== '') {
      inputRefs.phoneNumber.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (password === '') {
      setErrors({
        ...errors,
        password: 'This field is required',
      });
      inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (password.length < 6) {
      setErrors({
        ...errors,
        password: 'password must be at least 6 characters',
      });
      inputRefs.password.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const response = await userRegister(updatedValues);
      if (response.status === 200) {
        dispatch(_register(response.data.data));
        setRegistrationModal(false);
        dispatch(_toggleOverylay(false));
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div
        // ref={ref}
        id="registrationModal"
        className={registrationModal ? 'fadeIn' : 'fadeOut'}
      >
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <form>
          <div className="_header">
            <div>
              <h4>Create Account</h4>
              <p>Enter your Details to register</p>
            </div>
            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  setRegistrationModal(false);
                  dispatch(_toggleOverylay(false));
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.firstName}>
              <div className="floating-label">
                <input
                  type="text"
                  // className="form-control custom-input"
                  className={`form-control ${errors.first_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="firstName"
                  required
                  placeholder="First Name"
                  value={values?.first_name ?? ''}
                  onChange={(e) => setValues({ ...values, first_name: e.target.value })}
                  onFocus={() => setErrors({ ...errors, first_name: '' })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.first_name}</span>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.lastName}>
              <div className="floating-label">
                <input
                  type="text"
                  // className="form-control custom-input"
                  className={`form-control ${errors.last_name !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="lastName"
                  required
                  placeholder="Last Name"
                  value={values?.last_name ?? ''}
                  onChange={(e) => setValues({ ...values, last_name: e.target.value })}
                  onFocus={() => setErrors({ ...errors, last_name: '' })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.last_name}</span>
          </div>
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.email}>
              <div className="floating-label">
                <input
                  type="email"
                  // className="form-control custom-input"
                  className={`form-control ${errors.email !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="email-1"
                  required
                  placeholder="Email"
                  value={values?.email ?? ''}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      email: e.target.value.replace(/\s/g, ''),
                    })
                  }
                  onFocus={() => setErrors({ ...errors, email: '' })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.email}</span>
          </div>
          <div className="form-group row" ref={inputRefs.phoneNumber}>
            <div onFocus={() => setErrors({ ...errors, phone: '' })}>
              <PhoneNumberInput
                onChange={(phone) => setValues({ ...values, phone: phone })}
                onPhoneCode={(code) => setValues({ ...values, phone_code: code })}
                isFromPayment={false}
                setErrors={setErrors}
                errors={errors}
              />
            </div>
          </div>
          {/* <div className="text-danger">
            <span>{errors.phone}</span>
          </div> */}
          <div className="form-group row">
            <div className="col-md-12" ref={inputRefs.password}>
              <div className="floating-label input-container">
                <span className="input-icon">
                  {showPassword == false ? (
                    <img
                      className="_cursor_pointer"
                      onClick={() => handleTogglePassword()}
                      src="/imgs/icons/hidePassword.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  ) : (
                    <img
                      className="_cursor_pointer"
                      onClick={() => handleTogglePassword()}
                      src="/imgs/icons/eyeIcon.png"
                      alt="Icon"
                      width={15}
                      height={15}
                    />
                  )}
                </span>
                <input
                  type={showPassword == true ? 'text' : 'Password'}
                  className={`form-control ${errors.password !== '' ? 'custom-input-error' : 'custom-input'}`}
                  id="password"
                  required
                  placeholder="Password"
                  value={values?.password ?? ''}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  onFocus={() => setErrors({ ...errors, password: '' })}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{errors.password}</span>
          </div>
          <p>
            I have been able to read and understand the information on the use of my personal data explained in{' '}
            <Link
              to={'/privacy-policy'}
              onClick={() => {
                dispatch(_toggleOverylay(false));
                setRegistrationModal(false);
              }}
            >
              <b>Privacy Policy</b>
            </Link>
          </p>
          <Form.Group className="mb-3 _btnContainer">
            <Button
              // type="submit"
              variant="primary"
              className="_btnFlatCenter"
              onClick={onSubmit}
            >
              {loading ? <Spinner animation="border" size="sm" role="status" /> : 'Register'}
            </Button>
          </Form.Group>
          <p>
            Already member?{' '}
            <Link to={'#'} onClick={openLoginModal}>
              <b>Sign In</b>
            </Link>
          </p>
        </form>
      </div>

      <ForgotPasswordModal forgotPasswordModal={forgotPasswordModal} setForgotPasswordModal={setForgotPasswordModal} />
    </>
  );
}
export default RegistrationModal;
