import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./HOme";
import "./App.css";
import Customer from "./Customer";
import Billing from "./Billing";
import Database from "./Database";
import Ladger from "./Ladger";
import LoginPage from "./LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/customer",
        element: <Customer />,
      },
      {
        path: "/billing",
        element: <Billing />,
      },
      {
        path: "/database",
        element: <Database />,
      },
      {
        path: "/ladger",
        element: <Ladger />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}>
    <LoginPage />

      </RouterProvider>
    </>
  );
}

export default App;
