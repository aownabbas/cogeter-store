import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ResetPasswordModal from './ResetPasswordModal';
import { useForm } from 'react-hook-form';
import UseOnClickOutside from './useOnClickOutside';
import { forgotPassword } from '../actions/Authentication';
import { useDispatch, useSelector } from 'react-redux';
import { serverResponse } from '../helpers/Index';
import { toast } from 'react-toastify';
import { _toggleOverylay } from '../redux/actions/settingsAction';
import { errorRequestHandel, isValidEmailAddress } from '../utils/helperFile';
import CloseIcon from '../assets/icons/close-circle.svg';
import { onForGotPassword } from '../https/authentication';

function ForgotPasswordModal({ forgotPasswordModal, setForgotPasswordModal }) {
  const ref = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // UseOnClickOutside(ref, () => setForgotPasswordModal(false));

  const [resetPassword, setResetPasswordModal] = useState(false);

  const onSubmit = async () => {
    const isValidEmail = isValidEmailAddress(email);
    if (email === '') {
      setError('This field is required');
      return;
    } else if (!isValidEmail) {
      setError('Email is not valid');
      return;
    }
    try {
      const data = {
        email: email.trim(),
      };
      setLoading(true);
      const response = await onForGotPassword(data);
      if (response.status === 200) {
        dispatch(_toggleOverylay(false));
        setLoading(false);
        toast.success('Password reset link sent');
        setEmail('');
        setForgotPasswordModal(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  return (
    <>
      {' '}
      <div
        // ref={ref}
        id="registrationModal"
        className={forgotPasswordModal ? 'fadeIn' : 'fadeOut'}
      >
        <form>
          <div className="_header">
            <div>
              <h4>Update Password</h4>
              <p>
                If you have forgotten your password, enter your email address, and we will send a message with
                instructions on how to reset it.
              </p>
            </div>

            <div className="_close">
              <img
                className="_cursor_pointer"
                onClick={() => {
                  setForgotPasswordModal(false);
                  dispatch(_toggleOverylay(false));
                }}
                src={CloseIcon}
                alt="icons"
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-12">
              <div className="floating-label">
                <input
                  type="email"
                  className="form-control custom-input"
                  required
                  placeholder="Email"
                  value={email ?? ''}
                  onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                  onFocus={() => setError('')}
                />
              </div>
            </div>
          </div>
          <div className="text-danger">
            <span>{error}</span>
          </div>
          <Form.Group className="mb-3 _btnContainer">
            <Button variant="primary" className="_btnFlatCenter" onClick={onSubmit}>
              {loading ? <Spinner animation="border" size="sm" role="status" /> : 'Submit'}
            </Button>
          </Form.Group>
        </form>
      </div>
      <ResetPasswordModal resetPassword={resetPassword} setResetPasswordModal={setResetPasswordModal} />
    </>
  );
}
export default ForgotPasswordModal;
