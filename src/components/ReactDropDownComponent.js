function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var styles = { "container": "_1Lxpd", "dropdown": "_30Ipg", "dropdown_items_wrapper": "_1KMXW", "dropdown_items": "_2-_Xn", "input_wrapper": "_3LhE5", "country_search": "_3_9HH", "dropdown_item": "_34ETa", "dropdown_item_title": "_14Kkd", "selected_country": "_3Dx_t", "country_flag": "_2vjgV" };
var CaretDownIcon = function CaretDownIcon(props) {
    var setStyle = function setStyle() {
        var style;
        switch (props.point) {
            case 'up':
                style = {
                    position: 'absolute',
                    color: '#696969',
                    right: '20px',
                    transition: 'all 0.3s',
                    transform: 'rotate(180deg)',
                    height: '16px'
                };
                break;
            case 'down':
                style = {
                    position: 'absolute',
                    right: '20px',
                    color: '#696969',
                    transition: 'all 0.3s',
                    height: '16px'
                };
                break;
            case 'up_white':
                style = {
                    position: 'absolute',
                    left: '10px',
                    top: '-10px',
                    transform: 'rotate(180deg)',
                    color: '#fff',
                    height: '16px'
                };
                break;
        }
        return style;
    };
    return /*#__PURE__*/React__default.createElement("svg", {
        "aria-hidden": "true",
        focusable: "false",
        "data-prefix": "fas",
        "data-icon": "caret-down",
        className: "svg-inline--fa fa-caret-down fa-w-10",
        role: "img",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 320 512",
        height: "18px",
        color: props.color,
        style: setStyle()
    }, /*#__PURE__*/React__default.createElement("path", {
        fill: "currentColor",
        d: "M31.3 192h257.3c17.8 0 26.7  21.5 14.1 34.1L174.1 354.8c-7.8  7.8-20.5 7.8-28.3 0L17.2 226.1C4.6  213.5 13.5 192 31.3 192z"
    }));
};

var ReactDropDownComponent = function ReactDropDownComponent(props) {
    var _useState = React.useState([]),
        countries = _useState[0],
        setCountries = _useState[1];
    var _useState2 = React.useState([]),
        countriesCopy = _useState2[0],
        setCountriesCopy = _useState2[1];
    var _useState3 = React.useState(false),
        open = _useState3[0],
        setOpen = _useState3[1];
    var _useState4 = React.useState({}),
        defaultCountry = _useState4[0],
        setDefaultCountry = _useState4[1];
    var dropdownRef = React.useRef(null);
    React.useEffect(function () {
        defaultCountrySetter(props.countryCode ? props.countryCode : '');
        countryList().then(res => {
            setCountries(res);
            setCountriesCopy(res);
        });
        document.addEventListener('mousedown', handleClickOutSide);
    }, [props.countryCode]);
    var defaultCountrySetter = function defaultCountrySetter(d) {
        if (d == "") return;
        countryList().then(countries => {
            var defaultC = countries.filter(function (country) {
                return country.alpha2Code.toLowerCase() === d.toLowerCase();
            });
            setDefaultCountry(defaultC[0]);
        });
    };
    let countryList = async () => {
        let response = await fetch('/country.json');
        response = response.json();
        return response;
    }
    var preFetchCountries = function preFetchCountries() {
        return;
        try {
            return Promise.resolve(fetch('https://restcountries.com/v2/all')).then(function (data) {
                return Promise.resolve(data.json());
            });
        } catch (e) {
            return Promise.reject(e);
        }
    };
    var handleClickOutSide = function handleClickOutSide(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };
    var toggleDropDown = function toggleDropDown() {
        if (!open) {
            setCountries(countriesCopy);
        }
        setOpen(!open);
    };
    var handleCountryClick = function handleCountryClick(country) {
        var result = {
            name: country === null || country === void 0 ? void 0 : country.name,
            code: country === null || country === void 0 ? void 0 : country.alpha2Code,
            capital: country === null || country === void 0 ? void 0 : country.capital,
            region: country === null || country === void 0 ? void 0 : country.region,
            latlng: country === null || country === void 0 ? void 0 : country.latlng
        };
        setDefaultCountry(country);
        if (props.onSelect) {
            props.onSelect(result);
        }
        toggleDropDown();
    };
    var handleSearchInput = function handleSearchInput(e) {
        var input = e.target.value.toLowerCase();
        var filteredCountries = countriesCopy.filter(function (i) {
            return i.name.toLowerCase().includes(input.toLowerCase());
        });
        setCountries(filteredCountries);
    };
    return /*#__PURE__*/React__default.createElement("div", {
        className: styles.container,
        ref: dropdownRef
    }, /*#__PURE__*/React__default.createElement("div", {
        className: styles.dropdown,
        onClick: toggleDropDown
    }, /*#__PURE__*/React__default.createElement("img", {
        className: styles.country_flag,
        src: defaultCountry === null || defaultCountry === void 0 ? void 0 : defaultCountry.flag,
        alt: defaultCountry === null || defaultCountry === void 0 ? void 0 : defaultCountry.name
    }), /*#__PURE__*/React__default.createElement("span", {
        className: styles.selected_country
    }, defaultCountry.alpha2Code), /*#__PURE__*/React__default.createElement(CaretDownIcon, {
        point: open ? 'up' : 'down'
    })), open && /*#__PURE__*/React__default.createElement("div", {
        className: styles.dropdown_items_wrapper
    }, /*#__PURE__*/React__default.createElement(CaretDownIcon, {
        point: "up_white"
    }), /*#__PURE__*/React__default.createElement("div", {
        className: styles.input_wrapper
    }, /*#__PURE__*/React__default.createElement("input", {
        onChange: function onChange(e) {
            return handleSearchInput(e);
        },
        className: styles.country_search,
        type: "text",
        placeholder: "search coutries..."
    })), /*#__PURE__*/React__default.createElement("div", {
        className: styles.dropdown_items
    }, countries.map(function (i, index) {
        return /*#__PURE__*/React__default.createElement("div", {
            key: index,
            onClick: function onClick() {
                return handleCountryClick(i);
            },
            className: styles.dropdown_item
        }, /*#__PURE__*/React__default.createElement("img", {
            className: styles.country_flag,
            src: i.flag,
            alt: ""
        }), /*#__PURE__*/React__default.createElement("span", {
            className: styles.dropdown_item_title
        }, " ", i.name));
    }))));
};

exports.ReactDropDownComponent = ReactDropDownComponent;
//# sourceMappingURL=index.js.map
