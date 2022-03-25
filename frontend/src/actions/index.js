import { SET_USER_ADDRESS, UPDATE_DASHBOARD_MODAL } from "../constants";

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