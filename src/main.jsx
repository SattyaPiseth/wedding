import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx"; // Root layout
import Home from "./pages/Home.jsx";
import ErrorPage from "./routes/ErrorPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,            // main layout
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      // add more pages here, e.g.:
      // { path: "gallery", element: <Gallery />, loader: galleryLoader }
      // { path: "rsvp", element: <Rsvp />, action: rsvpAction }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
