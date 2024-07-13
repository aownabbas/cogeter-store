import React, { useEffect, useState } from "react";
import "./style.css";
import CustomModal from "../modal/CustomModal";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { formatRichText } from "../../utils/helperFile";
import CloseIcon from "../../assets/icons/close-circle.svg";

const CartLinksOptions = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const [indentifier, setIdentifier] = useState("");
  const _siteContent = useSelector((state) => state._general.siteContent);

  const getValue = (type = "content") => {
    const currentPath = window.location.pathname.replace("/", ""); // This will remove the leading slash and give you the path.
    const _obj = _siteContent.find((item) => item.identifier === indentifier);
    return type === "title" ? _obj?.title : _obj?.content;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional for smooth scrolling
    });
  };

  const onClose = () => {
    setOpen(false);
  };
  const onOpenRefundPolicy = () => {
    scrollToTop();
    setOpen(true);
    setIdentifier("return-and-exchange");
  };
  const onOpenShippingPolicy = () => {
    scrollToTop();
    setOpen(true);
    setIdentifier("shipping-and-delivery");
  };
  const onOpenPrivacyPolicy = () => {
    scrollToTop();
    setOpen(true);
    setIdentifier("privacy-policy");
  };
  const onOpenTermsOfServices = () => {
    scrollToTop();
    setOpen(true);
    setIdentifier("terms-conditions");
  };
  const onOpenContactInformation = () => {
    scrollToTop();
    setOpen(true);
    setIdentifier("contact-us");
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("mode__open");
    } else {
      document.body.classList.remove("mode__open");
    }
  }, [open]);

  return (
    <>
      <div className="cart_links_options__container">
        <div className="cart_link_title" onClick={onOpenRefundPolicy}>
          <p>Refund Policy</p>
        </div>
        <div className="cart_link_title" onClick={onOpenShippingPolicy}>
          <p>Shipping Policy</p>
        </div>
        <div className="cart_link_title" onClick={onOpenPrivacyPolicy}>
          <p>Privacy Policy</p>
        </div>
        <div className="cart_link_title" onClick={onOpenTermsOfServices}>
          <p>Terms of Services</p>
        </div>
        <div className="cart_link_title" onClick={onOpenContactInformation}>
          <p>Contact Information</p>
        </div>
      </div>

      <CustomModal open={open} onCloseModal={onClose} showCloseIcon={true}>
        <div id="aboutUs">
          <h3 style={{ marginBottom: 30 }}>{getValue("title")}</h3>
          <div id="markdown-container">
            <ReactMarkdown>{formatRichText(getValue())}</ReactMarkdown>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default CartLinksOptions;
