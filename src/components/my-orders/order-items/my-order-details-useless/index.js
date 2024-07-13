import React, { useEffect, useState } from "react";
import SuperMaster from "../../../../layouts/SuperMaster";
import style from "./style.module.scss";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getOrdersDetails } from "../../../../https/ordersRequests";
import { errorRequestHandel } from "../../../../utils/helperFile";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );

  const fetchOrdersDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrdersDetails(params.id);
      if (response.status === 200) {
        setOrder(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  useEffect(() => {
    fetchOrdersDetails();
  }, []);

  return (
    <SuperMaster>
      <div className={style.orderDetailsContiner}>
        <Row className="justify-content-between">
          <Col xs="auto">
            <h3>{params?.id} - Details</h3>
          </Col>
          <Col xs="auto">
            {0 ? (
              <h3 className="text-success pb-4 ">Progress</h3>
            ) : (
              <h3 className="text-warning pb-4 ">InTransit</h3>
            )}
          </Col>
        </Row>
        <Card className={style.cardBorder}>
          <Card.Body>
            <Row xs={2} md={2} lg={2}>
              <Col>
                <h6>Full body Suits</h6>
              </Col>
              <Col>
                <h6 className="text-right">90 {selectedCountry?.currency}</h6>
              </Col>
              <Col>
                <h6>Size: XS</h6>
              </Col>
              <Col>
                <h6 className="text-right">Qty: 22</h6>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className={style.cardBorder}>
          <Card.Body>
            <Row xs={2} md={2} lg={2}>
              <Col>
                <h6>Full body Suits</h6>
              </Col>
              <Col>
                <h6 className="text-right">90 {selectedCountry?.currency}</h6>
              </Col>
              <Col>
                <h6>Size: XS</h6>
              </Col>
              <Col>
                <h6 className="text-right">Qty: 22</h6>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className={style.cardBorder}>
          <Card.Body>
            <Row xs={2} md={2} lg={2}>
              <Col>
                <h6>Full body Suits</h6>
              </Col>
              <Col>
                <h6 className="text-right">90 {selectedCountry?.currency}</h6>
              </Col>
              <Col>
                <h6>Size: XS</h6>
              </Col>
              <Col>
                <h6 className="text-right">Qty: 22</h6>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className={style.cardBorder}>
          <Card.Body>
            <Row xs={2} md={2} lg={2}>
              <Col>
                <h6>Full body Suits</h6>
              </Col>
              <Col>
                <h6 className="text-right">90 {selectedCountry?.currency}</h6>
              </Col>
              <Col>
                <h6>Size: XS</h6>
              </Col>
              <Col>
                <h6 className="text-right">Qty: 22</h6>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </SuperMaster>
  );
};

export default OrderDetails;
