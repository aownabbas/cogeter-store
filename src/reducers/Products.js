import * as actionTypes from '../actionTypes/Index.js';
import { SINGLE_PRODUCT_DETAIL } from '../redux/actions/product.js';
let initial_state = {
    payload: [],
    product: {},
    sale_enhancers:[],
    status: false,
    product_detail:{},
};
export default (state = initial_state, action) => {
    switch (action.type) {
        case SINGLE_PRODUCT_DETAIL:
            return {
                ...state,
                product_detail: action.payload,
                status: true,
            }
        case actionTypes.PRODUCTS:
            return {
                ...state,
                payload: action.payload,
                status: true,
            }
        case actionTypes.IS_FAVORITE:
            return {
                ...state,
                product: action.payload,
                status: true,
            }
        case actionTypes.FILTER_BASED_ON:
            return {
                ...state,
                payload: action.payload,
                status: true,
            }
        case actionTypes.GET_SALE_ENHANCER:
            return {
                ...state,
                sale_enhancers: action.payload,
                status: true,
            }


        default:
            return state;
    }
};