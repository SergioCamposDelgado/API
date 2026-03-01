import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import HourlyForecastPage from "./pages/HourlyForecastPage";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminPanelRoute } from "./components/AdminPanelRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/forecast/:day",
    Component: HourlyForecastPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/admin",
    Component: AdminPanelRoute,
  },
]);
