import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function RegistrationForm() {
    return (
        <div className="_registrationForm">
            <div className='_header'>
                <div className='_text'>
                    <h4>Create Account</h4>
                    <p>Enter your detail to register</p>
                </div>
                <div className='_icon'>
                    <span className='fa fa-times-circle'></span>
                </div>
            </div>
            <Form>
                <Form.Group className="mb-3 _queryInput _firstName" htmlFor="first_name">
                    <Form.Control type="text" placeholder="First Name" />
                </Form.Group>
                 <Form.Group className="mb-3 _queryInput _lastName" htmlFor="last_name">
                    <Form.Control type="text" placeholder="Last Name" />
                </Form.Group>
                <Form.Group className="mb-3 _queryInput _email" htmlFor="email">
                    <Form.Control type="text" placeholder="Email" />
                </Form.Group>
                <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                    <Form.Control type="text" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                    <Form.Control type="text" placeholder="Reset Password" />
                </Form.Group>
                <Form.Group className="mb-3 _termsCondition">
                    <p>I have been able to read and understand information on the user of my personal data explained in <Link to="/privacy-policy">Privacy Policy</Link></p>
                </Form.Group>
                <Form.Group className="mb-3 _btnContainer">
                    <Button variant="primary" className='_btnFlatCenter'>Register</Button>{' '}
                </Form.Group>
                <Form.Group className="mb-3 _loginLinkContainer">
                    Already member? <Link to="/login">Login</Link>
                </Form.Group>
            </Form>
        </div>
    )
}
export default RegistrationForm;
