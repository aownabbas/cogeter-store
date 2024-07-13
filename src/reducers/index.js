import { combineReducers } from 'redux';
import todo from './toDoReducer';
import authentication from './Authentication';
import sidebar from './LeftSideBar';
import categories from './Categories';
import products from './Products';
import search from './Search';
import cart from './Cart';
import categoryReducer from '../redux/reducers/category';
import productReducer from '../redux/reducers/product';
import cartReducer from '../redux/reducers/cart';
import wishlistReducer from '../redux/reducers/wishList';
import generalReducer from '../redux/reducers/generalReducer';
import settingsReducer from '../redux/reducers/settingsReducer';
import addressesReducer from '../redux/reducers/addresses';

export default combineReducers({
  todo,
  authentication,
  sidebar,
  search,
  categories,
  products,
  cart,
  // new work
  _categories: categoryReducer,
  _products: productReducer,
  _cart: cartReducer,
  _wishLists: wishlistReducer,
  _general: generalReducer,
  _settings: settingsReducer,
  _addresses: addressesReducer,
});
