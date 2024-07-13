import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { fetchCoupon } from "../actions/Cart";
import { applyCouponCode } from "../https/ordersRequests";
import { toast } from "react-toastify";
import { errorRequestHandel } from "../utils/helperFile";
function PromoCode(props) {
  const [_coupon, _setCoupon] = useState("");
  const [_isPromoCode, _setIsPromoCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartItems = useSelector((state) => state?._products.cartItems);

  const [hasNonSaleItems, setHasNonSaleItem] = useState(cartItems?.some(item => !item.onSale) ?? false);

  const handleClickOnApplyButton = async () => {

    if (!hasNonSaleItems) {
      toast.warn("Promo codes cannot be applied to items already on sale.");
      return;
    }
    if (props.cartItems)
      if (_coupon === "") {
        toast.warn("Enter promo code");
        return;
      }
    try {
      setLoading(true);
      const response = await applyCouponCode({ code: _coupon });
      if (response.status === 200) {
        const minApplicableAmount = response.data?.data?.min_amount;
        if (minApplicableAmount > props.subTotal) {
          _setIsPromoCode(false);
          const minUserCurrencyAmount = parseInt(minApplicableAmount * props.rateMultiplier);
          toast.error(`Minimum cart amount ${minUserCurrencyAmount} ${props.currency} required for promo`);
        }
        else {
          toast.success("Discount applied");
          _setIsPromoCode(true);
          props.onApplyCoupon(response.data.data, _coupon);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      errorRequestHandel({ error: error });
    }
  };

  return (
    <div className={`_promoCode  ${_coupon.trim().length && _isPromoCode ? "_promoApplied" : ""}`}>
      <h3>Promo Code</h3>
      <div className="_inputContainer">
        <input
          placeholder="Type here"
          value={_coupon}
          onChange={(e) => {
            if (e.target.value?.trim() === "") {
              _setIsPromoCode(false);
            }
            _setCoupon(e.target.value)
          }}
          type="text"
        />
        <button type="button" onClick={handleClickOnApplyButton}>
          <>{_coupon.trim().length && _isPromoCode ? "Done !" : "Apply"}</>
        </button>
      </div>
      {/* {_isPromoCode && (<p>New year code applied!</p>)} */}
    </div >
  );
}

const mapStateToProps = (state) => {
  return {
    coupon: state.cart?.coupon,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCoupon: (url) => dispatch(fetchCoupon(url)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoCode);
