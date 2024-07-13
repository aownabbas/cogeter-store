import React from 'react'
import { Link } from 'react-router-dom';
function PaymentConfirmationModal({ isPaid, setIsPaid }) {
    return (
        <div className={`_cartModal _confirmationModal _hidden`} >
            <img src={process.env.PUBLIC_URL + '/imgs/payment-success.svg'} />
            <h3>Payment Completed Successfully</h3>
            <Link to={"#"}>Continue Shopping</Link>
        </div >
    )
}
export default PaymentConfirmationModal;
