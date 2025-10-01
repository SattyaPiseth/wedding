import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"; // Root layout
import ErrorPage from "./routes/ErrorPage.jsx";
import CoverPage from "./pages/CoverPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { coverLoader } from "./routes/loaders.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CoverPage />, loader: coverLoader },
      { path: "home", element: <HomePage /> },
      { path: ":uuid", element: <CoverPage />, loader: coverLoader },
      { path: "*", element: <ErrorPage /> }, // optional hardening
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
  </StrictMode>
);
