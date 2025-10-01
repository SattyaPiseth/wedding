import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"; // Root layout
import ErrorPage from "./routes/ErrorPage.jsx";
import CoverPage from "./pages/CoverPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import CustomerName from "./components/customer/CustomerName.jsx";

import { SpeedInsights } from "@vercel/speed-insights/react"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // main layout
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CoverPage /> },
      { path: "home", element: <HomePage /> },
      { path: ":uuid", element: <CustomerName /> }
      // add more pages here, e.g.:
      // { path: "gallery", element: <Gallery />, loader: galleryLoader }
      // { path: "rsvp", element: <Rsvp />, action: rsvpAction }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
  </StrictMode>
);
