import * as actionTypes from '../actionTypes/Index.js';
export default (state = true, action) => {
    switch (action.type) {
        case actionTypes.LEFT_SIDEBAR_OPEN:
            return action?.payload;
        case actionTypes.LEFT_SIDEBAR_CLOSE:
            return action?.payload;
        default:
            return state;
    }
};