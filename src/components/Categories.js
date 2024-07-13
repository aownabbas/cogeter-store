import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ASSET_URL } from "../utils/const";
import { _setSelectedCategory } from "../redux/actions/category";
import { addPreFixToMediaUrl } from "../utils/helperFile";
import { useLocation, useNavigate } from 'react-router-dom';

function Categories({ handelClickOnCategory, categoryId }) {
  const _allCategories = useSelector((state) => state._categories.categories);
  const selectedCategory = useSelector(
    (state) => state._categories.selectedCategory
  );

  const [identifier, setIndentifier] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const pathParts = currentUrl.pathname.split('/');
    const categoryIdentifier = pathParts[pathParts.length - 1];
    setIndentifier(categoryIdentifier);
  }, [location]);

  const category_item = () => {

    return _allCategories.map((category, index) => {
      return (
        <div key={index} className="_item" style={{ height: "10.8rem !important" }}>
          <div
            className="_img"
            onClick={() => {
              handelClickOnCategory(category.identifier);
            }}
          >
            {category?.cover_image !== null || category?.cover_image !== "" ? (
              <img
                src={addPreFixToMediaUrl(category?.cover_image)}
                alt={"/imgs/no_img.png"}
                loading="lazy"

              />
            ) : (
              <img
                src={"/imgs/no_img.png"}
                alt={"/imgs/no_img.png"}
                loading="lazy"
              />
            )}
          </div>
          <div className="_text">
            <h4
              style={{
                color: (category.identifier == identifier && window.location.pathname.includes('/categories')) ? "#7089FB" : "",
              }}
            >
              {category?.title}
            </h4>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="_categories" id="categories">
        {_allCategories ? category_item() : null}
      </div>
    </div>
  );
}

export default Categories;
