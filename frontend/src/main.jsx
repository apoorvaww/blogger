import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store, { persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import AddPostt from "./pages/AddPost.jsx";
import ViewBlog from "./pages/ViewBlog.jsx";
import EditPost from "./pages/EditPost.jsx";
import Post from "./components/Post.jsx";
import Profile from "./pages/Profile.jsx";
import UpdateDetails from "./pages/UpdateDetails.jsx";
import UpdateProfilePicture from "./pages/UpdateProfilePicture.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add-post",
        element: <AddPostt />,
      },
      {
        path: "/profile/u/:userId",
        element: <Profile />,
      },
      {
        path: "/update-account-details",
        element: <UpdateDetails />,
      },
      {
        path: '/update-avatar',
        element: <UpdateProfilePicture/>
      },
      {
        path: '/update-password',
        element: <UpdatePassword/>
      }
    ],
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/post/:id",
    element: <Post />,
  },
  {
    path: "/edit-blog/:blogId",
    element: <EditPost />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff", 
              color: "#374151",
              border: "1px solid #e5e7eb", 
              padding: "16px 20px", 
              borderRadius: "12px", 
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", 
              fontSize: "15px", 
              fontWeight: "500", // Medium font weight
            },
            success: {
              style: {
                background: "#f0fdf4", 
                color: "#166534", 
                border: "1px solid #dcfce7", 
              },
            },
            error: {
              style: {
                background: "#fff1f2", 
                color: "#991b1b", 
                border: "1px solid #fecaca",
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
