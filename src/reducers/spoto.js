import { combineReducers } from "redux";
import { UPDATE_DASHBOARD_MODAL } from "../constants";

const updateDashboardModexStage = (state = false, action) => {
    if (action.type === UPDATE_DASHBOARD_MODAL) {
        return action.value;
    }

    return state;
};
export default combineReducers({
    updateDashboardModexStage,
})