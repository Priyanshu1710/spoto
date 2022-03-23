import { UPDATE_DASHBOARD_MODAL } from "../constants";

export const setDashboardModalState = (value) => {
    return {
        type: UPDATE_DASHBOARD_MODAL,
        value,
    };
};