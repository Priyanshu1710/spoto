import { combineReducers } from "redux";
import { SET_USER_ADDRESS, SET_USER_BALANCE, SET_USER_HEX, UPDATE_DASHBOARD_MODAL } from "../constants";

const updateDashboardModexStage = (state = false, action) => {
    if (action.type === UPDATE_DASHBOARD_MODAL) {
        return action.value;
    }

    return state;
};
const userAdd = (state = false, action) => {
    if (action.type === SET_USER_ADDRESS) {
        return action.value;
    }

    return state;
};
const userBal = (state = 0, action) => {
    if (action.type === SET_USER_BALANCE) {
        return action.value;
    }

    return state;
};
const selectedUserhex = (state = false, action) => {
    if (action.type === SET_USER_HEX) {
        return action.value;
    }

    return state;
};


export default combineReducers({
    updateDashboardModexStage,
    userAdd,
    userBal,
    selectedUserhex,
})