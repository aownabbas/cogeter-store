import * as actionTypes from '../actionTypes/Index.js';
export const searchProducts = (payload) => {
    return {
        type: actionTypes.SEARCH,
        payload
    }
};
