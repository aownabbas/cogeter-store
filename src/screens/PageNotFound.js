import React from 'react'
import SuperMaster from '../layouts/SuperMaster';
import { Link } from 'react-router-dom';
function PageNotFound() {
    return (
        <SuperMaster>
            <div id="pageNotFound">
                <div className='_column1'>
                    <img src={process.env.PUBLIC_URL + '/imgs/pageNotFound.svg'} />
                </div>
                <div className='_column2'>
                    <h3>Something went Wrong.</h3>
                    <p>We couldn't find this page, Don't let this stop you and keep browsing.</p>
                    <div className='_buttons'>
                        <Link to={"/"}>Go Home</Link>
                        <Link to={"/"}>Previous Page</Link>
                    </div>
                </div>
            </div>
        </SuperMaster>
    )
}
export default PageNotFound;