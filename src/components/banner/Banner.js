import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { _setSelectedCategory } from '../../redux/actions/category';
import { useDispatch } from 'react-redux';
import endPoints from '../../https/endPoints';

function Banner({ banner }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  return (
    <>
      <section>
        <div className="_banner_dev" onClick={() => handelClickOnCategory(banner.category_id)}>
          {banner?.desktop_image_url && (
            <img className="desk-img" src={banner?.desktop_image_url} alt="Banner Image" loading="lazy" />
          )
          }
          {(banner?.mobile_image_url && (!videoLoaded || banner.mobile_video_url === '')) && (
            <img className="mob-img" src={banner.mobile_image_url} alt="Mobile Banner Image" loading="lazy" />
          )}
          {(banner?.mobile_video_url && banner?.mobile_video_url !== '') && (
            <video
              className={`mob-video ${videoLoaded ? 'visible' : 'hidden'}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              width="100%"
              onLoadedData={() => setVideoLoaded(true)}
            >
              <source src={banner.mobile_video_url ?? banner.desktop_image_url} type="video/mp4" />
            </video>
          )}
        </div>
      </section>
    </>
  );
}
export default Banner;
