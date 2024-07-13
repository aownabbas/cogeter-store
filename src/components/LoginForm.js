import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function LoginForm() {
    return (
        <div className="_registrationForm">
            <div className='_header'>
                <div className='_text'>
                    <h4>Login</h4>
                    <p>Type you email address & password</p>
                </div>
                <div className='_icon'>
                    <span className='fa fa-times-circle'></span>
                </div>
            </div>
            <Form>
                <Form.Group className="mb-3 _queryInput _email" htmlFor="email">
                    <Form.Control type="text" placeholder="Email" />
                </Form.Group>
                <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                    <Form.Control type="text" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3 _forgotPassword">
                    <Link to={'/forgot-password'}>Forgot Password ?</Link>
                </Form.Group>
                <Form.Group className="mb-3 _btnContainer">
                    <Button variant="primary" className='_btnFlatCenter'>Login</Button>{' '}
                </Form.Group>
                <Form.Group className="mb-3 _createAccountLinkContainer">
                    <Link to="/create-account">Don't have Cogeter.com account ?</Link>
                </Form.Group>
                <Form.Group className="mb-3 _btnContainer _createAccountBtnContainer">
                    <Button variant="primary _btnFlatCenter">Create Account</Button>{' '}
                </Form.Group>
            </Form>
        </div>
    )
}
export default LoginForm;
