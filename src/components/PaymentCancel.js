import React from 'react'
import { Link } from 'react-router-dom';
function PaymentCancel() {
    return (
        <div className={`_cartModal _confirmationModal  _confirmationModalCancel _hidden`} >
            <img src={process.env.PUBLIC_URL + '/imgs/payment-success.svg'} />
            <h3>Your order has been cancelled</h3>
            <Link to={"#"}>Continue Shopping</Link>
        </div >
    )
}
export default PaymentCancel;
