import Dashboard from "./pages/Dashboard";
import LiveMatches from "./pages/LiveMatches";
import ProfilePage from "./pages/ProfilePage";
import SelectSport from "./pages/SportPage";
import Arena from './pages/Arena';
import SelectProfile from "./pages/SelectProfile";
import ActiveBet from "./pages/activeBet";
import LiveActiveBet from "./pages/activeBetForCurrent";


const routes = [
    {
        path: "/homepage",
        element: <Dashboard />,
    },
    {
        path: "/selectProfile",
        element: <SelectProfile />,
    },
    {
        path: "/profile",
        element: <ProfilePage />,
    },
    {
        path: "/selectSport",
        element: <SelectSport />,
    },
    {
        path: "/liveMatches",
        element: <LiveMatches />,
    },
    {
        path: "/activeBet",
        element: <ActiveBet />,
    },
    {
        path: "/liveActiveBet",
        element: <LiveActiveBet />,
    },
    {
        path: "/arena",
        element: <Arena />,
    },


];

export default routes;
