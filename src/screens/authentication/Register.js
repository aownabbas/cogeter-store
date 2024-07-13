import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import RegistrationForm from '../../components/RegistrationForm';
import 'font-awesome/css/font-awesome.min.css';
import '../../style.css'
import { Link } from 'react-router-dom';
function Register() {
  return (
    <Container id='registrationContainer'>
      <Row >
        <Col sm={8} lg={8} xl={8} className='_loginLeftSideArea'>
          <div>
            <div>
              <Row className='_loginHeader'>
                <Col id="logo"><Link to={"/"}><img src={process.env.PUBLIC_URL + '/imgs/logo.png'} /></Link>
                </Col>
                <Col>
                  <Form.Group className="mb-3 _queryInput" htmlFor="password">
                    <div className="fa fa-search icon"></div>
                    <Form.Control className="_inputWithIcon" type="text" placeholder="Search" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='_login_Menu'>
                    <div className='_item'>
                      <div className='_img'>
                        <img src={process.env.PUBLIC_URL + '/imgs/login/new.jpg'} alt='/imgs/no_img.png'/>
                      </div>
                      <span>New In</span>
                    </div>
                    <div className='_item'>
                      <div className='_img'>
                        <img src={process.env.PUBLIC_URL + '/imgs/login/top.jpg'} alt='/imgs/no_img.png'/>
                      </div>
                      <span>Tops</span>
                    </div>
                    <div className='_item'>
                      <div className='_img'>
                        <img src={process.env.PUBLIC_URL + '/imgs/login/bottom.jpg'} alt='/imgs/no_img.png'/>
                      </div>
                      <span>Bottom</span>
                    </div>
                    <div className='_item'>
                      <div className='_img'>
                        <img src={process.env.PUBLIC_URL + '/imgs/login/bodySuites.jpg'} alt='/imgs/no_img.png'/>
                      </div>
                      <span>Body Suits</span>
                    </div>
                    <div className='_item'>
                      <div className='_img'>
                        <img src={process.env.PUBLIC_URL + '/imgs/login/collection.jpg'} alt='/imgs/no_img.png'/>
                      </div>
                      <span>Collections</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <div className='_footer'>
                  <div className='_header'><span className='_yellow'>In publishing and graphic design,  </span><span className='_white'>Lorem ipsum is a placeholdertext commonly </span><span className='_yellow'>used to demonstrate the visual</span></div>
                  <div className='_body'>
                    <img className='_loginBack' src={process.env.PUBLIC_URL + '/imgs/login/loginBack.jpg'} />
                  </div>
                </div>
              </Row>
            </div>
          </div>
        </Col>
        <Col sm={12} lg={4} xl={4}><RegistrationForm /></Col>
      </Row>
    </Container>
  )
}
export default Register;
