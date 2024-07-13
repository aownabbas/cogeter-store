import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import CloseIcon from "../assets/icons/close-circle.svg";
import { useDispatch } from "react-redux";
import { _toggleOverylay } from "../redux/actions/settingsAction";

function FilterModal({
  filterModal,
  setFilterModal,
  onSelectColor,
  onSelectSize,
  onSelectSortBy,
}) {
  const [_sortBy, _setSortBy] = useState("");
  const [_sizeFilter, _setSizeFilter] = useState("");
  const [_colorFilter, _setColorFilter] = useState("");
  const dispatch = useDispatch();
  const colors = [
    { title: "Grey", code: "#808080" },
    { title: "Beige", code: "#F5F5DC" },
    { title: "Black", code: "#000000" },
    { title: "Blue", code: "#0000FF" },
    { title: "Brown", code: "#8B4513" },
    { title: "Green", code: "#008000" },
    { title: "Khaki", code: "#C3B091" },
    { title: "Light Grey", code: "#D3D3D3" },
    { title: "Maroon", code: "#800000" },
    { title: "Orange", code: "#FFA500" },
    { title: "Pink", code: "#FFC0CB" },
    { title: "Purple", code: "#800080" },
    { title: "Red", code: "#FF0000" },
    { title: "White", code: "#FFFFFF" },
    { title: "Yellow", code: "#FFFF00" },
  ];
  const sizes = [
    { title: "Small", value: "S" },
    { title: "Medium", value: "M" },
    { title: "Large", value: "L" },
  ];

  const clearFilter = () => {
    _setColorFilter("");
    _setSizeFilter("");
    _setSortBy("");
    onSelectColor("");
    onSelectSize("");
    onSelectSortBy("");
    setFilterModal(false);
    dispatch(_toggleOverylay(false));
  };
  const applyFilter = () => {
    onSelectColor(_colorFilter);
    onSelectSize(_sizeFilter);
    onSelectSortBy(_sortBy);
    setFilterModal(false);
    dispatch(_toggleOverylay(false));
  };

  // UseOnClickOutside(() => setFilterModal(false));
  return (
    <>
      <div id="filterModal" className={`${!filterModal ? "_hidden" : ""}`}>
        <div className="_header">
          <div className="_filters">
            <h3>Filters</h3>
            <h4 onClick={clearFilter} className="_clear__filter">
              Clear
            </h4>
            {/* <img
              className="_cursor_pointer"
              onClick={clearFilter}
              src={CloseIcon}
              alt=""
            /> */}
          </div>
        </div>
        <div className="_body">
          <div className="_colors">
            <h3>COLOR</h3>
            <div className="_container">
              <div className="_column">
                {colors.map((color, index) => {
                  return (
                    <div
                      className={`_color ${
                        color.title == _colorFilter ? "_active" : ""
                      }`}
                      style={{
                        backgroundColor: color.code,
                        outline: `${
                          color.code === "#FFFFFF"
                            ? "1px solid #eaeaea"
                            : "asas"
                        }`,
                      }}
                      key={index}
                      onClick={() => _setColorFilter(color.title)}
                    >
                      <p>{color?.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="_sizing">
            <h3>SIZING</h3>
            <div className="_buttons">
              <div>
                {sizes.map((size, index) => {
                  return (
                    <button
                      key={index}
                      className={`${
                        size.value == _sizeFilter ? "_active" : ""
                      }`}
                      onClick={() => _setSizeFilter(size.value)}
                    >
                      {size.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="_sorted_by">
            <h3>SORT BY</h3>
            <div className="_buttons">
              <button
                onClick={() => _setSortBy("price_asc")}
                className={`${_sortBy == "price_asc" ? "_active" : ""}`}
              >
                Price Low to High
              </button>
              <button
                onClick={() => _setSortBy("price_desc")}
                className={`${_sortBy == "price_desc" ? "_active" : ""}`}
              >
                Price High to Low
              </button>
            </div>
          </div>
        </div>
        <div className="_footer">
          <Form.Group className="mb-3 _btnContainer">
            <Button
              type="button"
              variant="primary"
              onClick={applyFilter}
              className="_btnFlatCenter"
            >
              Apply Filters
            </Button>
          </Form.Group>
          <Form.Group className="mb-3 _btnContainer">
            <Button
              type="button"
              variant="primary"
              onClick={clearFilter}
              className="_clearFilter"
            >
              CLOSE
            </Button>
          </Form.Group>
        </div>
      </div>
    </>
  );
}
export default FilterModal;
