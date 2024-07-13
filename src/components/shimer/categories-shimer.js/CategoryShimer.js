import React from 'react'
import ShimmerEffect from '../Shimer'
import './style.css'
const CategoryShimer = () => {
    const isSmall = window.innerWidth <= 540;
    return (
        <div className='category_shimer__container'>
            {Array(4).fill().map((_, index) => (
                <div key={index}>
                    <div className={`category_shimer ${isSmall ? 'small' : ''}`}>
                        <ShimmerEffect width={100} height={100} />
                    </div>

                </div>
            ))}
        </div>
    );
}

export default CategoryShimer
