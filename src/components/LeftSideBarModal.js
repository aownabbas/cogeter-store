import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UseOnClickOutside from './useOnClickOutside';
import { _setSelectedCategory } from '../redux/actions/category';
import CloseIcon from '../assets/icons/close-circle.svg';
import faceBook from '../assets/social-icons/facebook.svg';
import tiktok from '../assets/social-icons/tiktok.svg';
import instagram from '../assets/social-icons/instagram.svg';
import watsapp from '../assets/social-icons/watsapp.svg';
import LoginModal from './LoginModal';
import { isUserLoggedIn } from '../helpers/Index';
import { _toggleLoginModal, _toggleOverylay } from '../redux/actions/settingsAction';
import { openExternalLinks, openWhatsApp } from '../utils/helperFile';
import { SOCIAL_LINKS } from '../utils/const';
import endPoints from '../https/endPoints';

function LeftSideBarModal({ sideBarModal, setSideBarModal, sideBarRef }) {
  const dispatch = useDispatch();
  const [matches, setMatches] = useState(window.matchMedia('(max-width: 770px)').matches);
  const [loginModal, setLoginModal] = useState(false);
  const fetch_categories = useSelector((state) => state.categories);
  let categories = fetch_categories?.payload?.data?.data;

  const isLoggedIn = useSelector((state) => state._auth.isAuthenticated);

  useEffect(() => {
    window.matchMedia('(max-width: 770px)').addEventListener('change', (e) => setMatches(e.matches));
  }, []);

  const _allCategories = useSelector((state) => state._categories.categories);
  const [footerCategories, setFooterCategories] = useState([]);
  useEffect(() => {
    const _filteredCategories = _allCategories
      .filter((item) => item.show_in_footer !== null && item.show_in_footer)
      .slice(-5);
    setFooterCategories(_filteredCategories);
  }, [_allCategories]);

  const navigate = useNavigate();
  const handelClickOnCategory = (id) => {
    dispatch(_setSelectedCategory(id));
    dispatch(_toggleOverylay(false));
    navigate(`${endPoints.CATEGORIES}/${id}`);
  };

  const openLoginModal = () => {
    setSideBarModal(false);
    dispatch(_toggleLoginModal(true));
    dispatch(_toggleOverylay(true));
  };

  // UseOnClickOutside(sideBarRef, () => setSideBarModal(false));
  return (
    <>
      <LoginModal loginModal={loginModal} setLoginModal={setLoginModal} />
      <div ref={sideBarRef} id="leftSideBarModal" className={`_leftSideBarModal ${!sideBarModal ? '_hidden' : ''}`}>
        <ul>
          <li className="justify-content-end me-4">
            <img
              className="._cursor_pointer"
              onClick={() => {
                dispatch(_toggleOverylay(false));
                setSideBarModal(false);
              }}
              style={{ cursor: 'pointer' }}
              src={CloseIcon}
              width={24}
              height={24}
              alt="close"
            />
          </li>
          <li>
            <ul>
              {footerCategories?.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setSideBarModal(false);
                      handelClickOnCategory(item?.identifier);
                    }}
                  >
                    <Link to={'#'}>{item?.title.toUpperCase()}</Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            <ul>
              <li className='_cursor_pointer'
                // onClick={() => {
                //   setSideBarModal(false);
                //   document.querySelector('._mainContent').classList.add('_hidden');
                //   document.querySelector('._searchModal').classList.remove('_hidden');
                //   dispatch(_toggleOverylay());
                // }}
                onClick={async () => {
                  setSideBarModal(false);
                  navigate('/');
                  // Hide the main content
                  await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                  });
                  document.querySelector('._mainContent').classList.add('_hidden');
                  // Show the search modal
                  document.querySelector('._searchModal').classList.remove('_hidden');
                  dispatch(_toggleOverylay());
                }}
              >
                {/* <Link to={'/'}>SEARCH</Link> */}
                SEARCH
              </li>
              <li
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  dispatch(_toggleOverylay());
                  navigate('/cart');
                }}
              >
                CART
              </li>
              {isLoggedIn && (
                <li
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(_toggleOverylay());
                    navigate('/wish-list');
                  }}
                >
                  WISH LIST
                </li>
              )}
              {isLoggedIn ? (
                <li
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    dispatch(_toggleOverylay());
                    navigate('/profile');
                  }}
                >
                  ACCOUNT
                </li>
              ) : (
                <li>
                  <Link to={'#'} onClick={openLoginModal}>
                    ACCOUNT
                  </Link>
                </li>
              )}
            </ul>
          </li>
          <li>
            <ul>
              <li
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  dispatch(_toggleOverylay());
                  navigate('/customer-support');
                }}
              >
                CUSTOMER SUPPORT
              </li>
            </ul>
          </li>
        </ul>
        <div className="left_side_modal__socialicon__container">
          <div className="socialicon__container">
            <img src={faceBook} onClick={() => openExternalLinks(SOCIAL_LINKS.facebook)} />
            <img src={instagram} onClick={() => openExternalLinks(SOCIAL_LINKS.instagram)} />
            <img src={tiktok} onClick={() => openExternalLinks(SOCIAL_LINKS.tiktok)} />
          </div>
        </div>
      </div>
    </>
  );
}
export default LeftSideBarModal;
