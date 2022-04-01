import { combineReducers } from "redux";
import { SET_UPCOMING_MATCH_FIXTURE_ID, SET_USER_ADDRESS, SET_USER_BALANCE, SET_USER_DETAILS, SET_USER_HEX, UPDATE_DASHBOARD_MODAL } from "../constants";

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
const currentFixtureIdUpcomingMatches = (state = false, action) => {
    if (action.type === SET_UPCOMING_MATCH_FIXTURE_ID) {
        return action.value;
    }

    return state;
};
const gameUserDetails = (state = {
    NFTId: '',
    gameWon: '',
    gameLost: '',
    gameLevel: ''
}, action) => {
    if (action.type === SET_USER_DETAILS) {
        return ({
            ...action.value,
            NFTId: action.value.NTFID,
            gameWon: action.value.gameWon,
            gameLost: action.value.gameLost,
            gameLevel: action.value.gameLevel
        }
        );
    }

    return state;
};


export default combineReducers({
    updateDashboardModexStage,
    userAdd,
    userBal,
    selectedUserhex,
    currentFixtureIdUpcomingMatches,
    gameUserDetails,
})