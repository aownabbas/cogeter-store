import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import FooterUlItems from "./FooterUlItems";
import useWindowSize from "../utils/hooks/useWindowSize";

import { useDispatch, useSelector } from "react-redux";
import {
  _getAllCategories,
  _setSelectedCategory,
} from "../redux/actions/category";
import { _emptyAllProducts } from "../redux/actions/product";
import { openExternalLinks } from "../utils/helperFile";
import PaymentMethod from "./resuable/payment-methods/PaymentMethod";
import endPoints from "../https/endPoints";

function Footer() {
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const selectedCountry = useSelector(
    (state) => state._settings.selectedCountry
  );
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 770px)").matches
  );
  useEffect(() => {
    window
      .matchMedia("(max-width: 770px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  const [isFirstUlCollapse, setIsFirstUlCollapse] = useState(true);
  const [isSecondUlCollapse, setIsSecondUlCollapse] = useState(true);
  const [isThirdUlCollapse, setIsThirdUlCollapse] = useState(true);
  const [isFourthUlCollapse, setIsFourthUlCollapse] = useState(true);

  const _allCategories = useSelector((state) => state._categories.categories);
  const [footerCategories, setFooterCategories] = useState([]);

  const appVersion = localStorage.getItem("appVersion") ?? "1.0";

  useEffect(() => {
    const _filteredCategories = _allCategories
      .filter((item) => item.show_in_footer !== null && item.show_in_footer)
      .slice(-5);
    setFooterCategories(_filteredCategories);
  }, [_allCategories]);

  const navigate = useNavigate();
  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="">
        <Container className="_footerContainer" fluid={true}>
          <Row>
            <Col>
              <ul>
                <ul>
                  <li>SHOP</li>
                  <li
                    className="_hidden"
                    onClick={() => setIsFirstUlCollapse((prev) => !prev)}
                  >
                    <span
                      className={`fa ${isFirstUlCollapse ? "fa-angle-left" : "fa-angle-down"
                        }`}
                    ></span>
                  </li>
                </ul>
                <Collapse isOpened={!matches ? true : isFirstUlCollapse}>
                  {footerCategories?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        onClick={() => handelClickOnCategory(item?.identifier)}
                      >
                        <Link to={"#"}>{item?.title}</Link>
                      </li>
                    );
                  })}
                </Collapse>
              </ul>
            </Col>

            <FooterUlItems
              isSecondUlCollapse={isSecondUlCollapse}
              isThirdUlCollapse={isThirdUlCollapse}
              isFourthUlCollapse={isFourthUlCollapse}
              setIsSecondUlCollapse={setIsSecondUlCollapse}
              setIsThirdUlCollapse={setIsThirdUlCollapse}
              setIsFourthUlCollapse={setIsFourthUlCollapse}
            />
          </Row>
        </Container>
        <div id="copyright">
          <Row className="justify-content-between _footerRow">
            {width < 769 && (
              <Col>
                <PaymentMethod hideText={true} />
              </Col>
            )}
            <Col className={`_firstColumn ${width < 789 && "_forMobile"}`}>
              <span>
                <Link to={"/terms-conditions"} style={{ color: "#000000" }}>
                  TERMS & CONDITIONS
                </Link>
              </span>
              <span>
                <Link to={"/privacy-policy"} style={{ color: "#000000" }}>
                  PRIVACY POLICY
                </Link>
              </span>
              <span>
                <Link to={"/cookies-policy"} style={{ color: "#000000" }}>
                  COOKIES POLICY
                </Link>
              </span>
            </Col>
            <Col
              className="_colCenter"
              onClick={() => openExternalLinks("https://www.pureelements.ae/")}
            >
              <p style={{ cursor: "pointer" }} className="text-truncate">
                © 2023{" "}
                <span style={{ textDecoration: "underline" }}>
                  PURE ELEMENTS
                </span>{" "}
                - v {appVersion}
              </p>
            </Col>
            {width > 768 && (
              <Col>
                <PaymentMethod hideText={true} />
              </Col>
            )}
          </Row>
        </div>
      </footer>
    </>
  );
}
export default Footer;
