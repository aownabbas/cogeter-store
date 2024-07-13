import React from "react";
import { Col } from "react-bootstrap";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { openExternalLinks } from "../utils/helperFile";
import { SOCIAL_LINKS } from "../utils/const";
function FooterUlItems({
  isSecondUlCollapse,
  isThirdUlCollapse,
  isFourthUlCollapse,
  setIsSecondUlCollapse,
  setIsThirdUlCollapse,
  setIsFourthUlCollapse,
}) {
  return (
    <>
      <Col>
        <ul>
          <ul>
            <li>ABOUT</li>
            <li
              className="_hidden"
              onClick={() => setIsSecondUlCollapse((prev) => !prev)}
            >
              <span
                className={`fa ${isSecondUlCollapse ? "fa-angle-left" : "fa-angle-down"
                  }`}
              ></span>
            </li>
          </ul>
          <Collapse isOpened={isSecondUlCollapse}>
            <li>
              <Link to={"/our-story"}>OUR STORY</Link>
            </li>
            <li>
              <Link to={"/brand-partnerships"}>BRAND PARTNERSHIPS</Link>
            </li>
          </Collapse>
        </ul>
      </Col>
      <Col>
        <ul>
          <ul>
            <li className="text-truncate">CUSTOMER SUPPORT</li>
            <li
              className="_hidden"
              onClick={() => setIsThirdUlCollapse((prev) => !prev)}
            >
              <span
                className={`fa ${isThirdUlCollapse ? "fa-angle-left" : "fa-angle-down"
                  }`}
              ></span>
            </li>
          </ul>
          <Collapse isOpened={isThirdUlCollapse}>
            <li>
              <Link to={"/shipping-and-delivery"}>SHIPPING AND DELIVERY</Link>
            </li>
            <li>
              <Link to={"/return-and-exchange"}>RETURN AND EXCHANGES</Link>
            </li>
            <li>
              <Link to={"/faqs"}>FAQS</Link>
            </li>
            <li>
              <Link to={"/contact-us"}>CONTACT US</Link>
            </li>
          </Collapse>
        </ul>
      </Col>

      <Col>
        <ul>
          <ul>
            <li>SOCIAL</li>
            <li
              className="_hidden"
              onClick={() => setIsFourthUlCollapse((prev) => !prev)}
            >
              <span
                className={`fa ${isFourthUlCollapse ? "fa-angle-left" : "fa-angle-down"
                  }`}
              ></span>
            </li>
          </ul>
          <Collapse isOpened={isFourthUlCollapse}>
            <li>
              <Link
                to={"#"}
                onClick={(e) => {
                  e.preventDefault();
                  openExternalLinks(SOCIAL_LINKS.facebook);
                }}
              >
                FACEBOOK
              </Link>
            </li>
            <li>
              <Link
                to={"#"}
                onClick={(e) => {
                  e.preventDefault();
                  openExternalLinks(SOCIAL_LINKS.instagram);
                }}
              >
                INSTAGRAM
              </Link>
            </li>
            <li>
              <Link
                to={"#"}
                onClick={(e) => {
                  e.preventDefault();
                  openExternalLinks(SOCIAL_LINKS.tiktok);
                }}
              >
                TIKTOK
              </Link>
            </li>
          </Collapse>
        </ul>
      </Col>
    </>
  );
}

export default FooterUlItems;
