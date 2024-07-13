import * as actionTypes from '../actionTypes/Index.js';
export default (state = "", action) => {
    switch (action.type) {
        case actionTypes.SEARCH:
            return action?.payload;
        default:
            return state;
    }
};