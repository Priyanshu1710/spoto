import Dashboard from "./pages/Dashboard";
import LiveMatches from "./pages/LiveMatches";
import ProfilePage from "./pages/ProfilePage";
import SelectSport from "./pages/SportPage";
import Arena from './pages/Arena';


const routes = [
    {
        path: "/homepage",
        element: <Dashboard />,
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
        path: "/arena",
        element: <Arena />,
    },


];

export default routes;
