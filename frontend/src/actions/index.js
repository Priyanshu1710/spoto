import { SET_USER_ADDRESS, SET_USER_BALANCE, UPDATE_DASHBOARD_MODAL } from "../constants";

export const setDashboardModalState = (value) => {
    return {
        type: UPDATE_DASHBOARD_MODAL,
        value,
    };
};
export const setUserAdd = (value) => {
    return {
        type: SET_USER_ADDRESS,
        value,
    };
};
export const setUserBal = (value) => {
    return {
        type: SET_USER_BALANCE,
        value,
    };
};