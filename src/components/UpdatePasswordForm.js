import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function UpdatePasswordForm() {
    return (
        <section id='body'>
            <Row>
                <Col sm={12} lg={12} xl={12} >
                    <Form>
                        <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                            <h4>Update Password</h4>
                        </Form.Group>
                        <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                            <Form.Control type="text" placeholder="New Password" />
                        </Form.Group>
                        <Form.Group className="mb-3 _queryInput _password" htmlFor="password">
                            <Form.Control type="text" placeholder="Confirm Password" />
                        </Form.Group>
                        <Form.Group className="mb-3 _btnContainer">
                            <Button variant="primary" className='_btnFlatCenter'>Update Password</Button>{' '}
                        </Form.Group>
                    </Form>
                </Col>
            </Row >
        </section>
    )
}
export default UpdatePasswordForm;
