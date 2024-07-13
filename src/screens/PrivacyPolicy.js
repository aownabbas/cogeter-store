import React from 'react'
import SuperMaster from '../layouts/SuperMaster';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function PrivacyPolicy() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate("/profile", { state: { from: 'my-personal-detail' } });
    }
    return (
        <SuperMaster>
            <div id="aboutUs">
                <h3>Privacy Policy</h3>
                <p>
                    Cogeter is a leading affordable fashion company operating globally. With a strong presence in multiple markets, including Spain, Portugal, Andorra, Mexico, Qatar, Saudi Arabia, Morocco, Tunisia, the United Arab Emirates, Egypt, Israel, Bahrain, Tunisia, and Oman, Cogeter has established itself as a prominent player in the fashion industry. As part of the renowned Inditex Group, one of the largest distribution groups worldwide, Cogeter embodies a commitment to quality and style.
                </p>
                <h3>At Cogeter</h3>
                <p>
                    Our mission is to cater to a diverse range of customers, regardless of age or gender. We offer a wide selection of fashionable items for women, men, girls, boys, and babies, with dedicated footwear and accessory lines for each category. In addition to our clothing collections, we also provide Homewear, Sportswear, and Underwear options, ensuring a comprehensive range of products to meet our customers' needs. Our business model revolves around designing, manufacturing, distributing, and selling our fashion merchandise through an extensive network of Cogeter stores. With a focus on delivering exceptional value, quality, and style, we strive to create a seamless and enjoyable shopping experience for our customers.
                </p>
            </div>
        </SuperMaster>
    )
}
export default PrivacyPolicy;