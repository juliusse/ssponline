import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "@/App";


const AppWrapper = () => {
  return (
    <Outlet />
  );
};

const routes = createRoutesFromElements(
  <Route path="/" element={<AppWrapper />}>
    <Route index element={<Navigate to="/game" />} />
    <Route
      path="game"
      element={<App />}
    />

    <Route path="*" element={<Navigate to="/game" />} />
  </Route>,
);

export const router = createBrowserRouter(routes);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
