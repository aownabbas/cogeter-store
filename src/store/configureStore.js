// import { createStore, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "../reducers";
// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// export default function configureStore(initialState) {
//   return createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));
// }

import { applyMiddleware, combineReducers, createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";

import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";
import toDoReducer from "../reducers/toDoReducer";
import Authentication from "../reducers/Authentication";
import LeftSideBar from "../reducers/LeftSideBar";
import Search from "../reducers/Search";
import Categories from "../reducers/Categories";
import Products from "../reducers/Products";
import Cart from "../reducers/Cart";
import categoryReducer from "../redux/reducers/category";
import productReducer from "../redux/reducers/product";
import cartReducer from "../redux/reducers/cart";
import wishlistReducer from "../redux/reducers/wishList";
import generalReducer from "../redux/reducers/generalReducer";
import settingsReducer from "../redux/reducers/settingsReducer";
import addressesReducer from "../redux/reducers/addresses";
import authenticationReducer from "../redux/reducers/authentication";

const rootReducer = combineReducers({
  todo: toDoReducer,
  authentication: Authentication,
  sidebar: LeftSideBar,
  search: Search,
  categories: Categories,
  products: Products,
  cart: Cart,
  // new work
  _categories: categoryReducer,
  _products: productReducer,
  // _cart: cartReducer,
  _wishLists: wishlistReducer,
  _general: generalReducer,
  _settings: settingsReducer,
  _addresses: addressesReducer,
  _auth: authenticationReducer,
});
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);
