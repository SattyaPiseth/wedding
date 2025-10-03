import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "aos/dist/aos.css";


import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";

import App from "./App.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";
import CoverPage from "./pages/CoverPage.jsx";
import HomePage  from "./pages/HomePage.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { coverLoader } from "./routes/loaders.js";

// Create router with deterministic scroll restoration across path + query changes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <ScrollRestoration getKey={(loc) => loc.pathname + loc.search} /> */}
        <App />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CoverPage />, loader: coverLoader },
      { path: "home", element: <HomePage /> },
      { path: ":uuid", element: <CoverPage />, loader: coverLoader },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
  </StrictMode>
);
