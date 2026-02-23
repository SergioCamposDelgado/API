import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import HourlyForecastPage from "./pages/HourlyForecastPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/forecast/:day",
    Component: HourlyForecastPage,
  },
]);
