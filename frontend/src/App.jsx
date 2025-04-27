import "./App.css";
import "./assets/css/Style.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./features/auth/pages/Login";
import ProtectedRoute from "./helpers/protectedRoute";
import PageLayout from "./layout/layout";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import ElectionPage from "./features/elections/pages/ElectionPage";
import CandidatePageList from "./features/candidates/pages/CandidatePageList";
import GroupPageList from "./features/groups/pages/GroupPageList";
import Register from "./features/auth/pages/Register";
import VerifyUserEmail from "./features/auth/pages/VerifyUserEmail";
import UserList from "./features/users/pages/UserList";
import UserPermissionList from "./features/users/pages/UserPermissionList";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasExpired = localStorage.getItem("online_voting_expiry_time");
    if (hasExpired) {
      const expiryTime = parseInt(hasExpired, 10); // Convert string to number
      const currentTime = Date.now();

      if (currentTime > expiryTime) {
        // Perform actions for expired time (e.g., clear localStorage, redirect login page
        localStorage.removeItem("online_voting_expiry_time");
        localStorage.removeItem("online_voting_access_token");
        localStorage.removeItem("online_voting_refresh_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("role");
      }
    } else {
      const currentLocation = location;
      if (
        currentLocation.pathname != "/register" &&
        !currentLocation.pathname.startsWith("/email/confirmation/")
      ) {
        console.log("currentLocation", currentLocation.pathname);
        navigate("/login");
      }
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route
          exact
          path="/email/confirmation/:token"
          element={<VerifyUserEmail />}
        />
        <Route
          exact
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout>
                <HomePage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/election"
          element={
            <ProtectedRoute>
              <PageLayout>
                <ElectionPage />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/candidate"
          element={
            <ProtectedRoute>
              <PageLayout>
                <CandidatePageList />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/group"
          element={
            <ProtectedRoute>
              <PageLayout>
                <GroupPageList />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/user"
          element={
            <ProtectedRoute>
              <PageLayout>
                <UserList />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/user/permission"
          element={
            <ProtectedRoute>
              <PageLayout>
                <UserPermissionList />
              </PageLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  const theme = createTheme({
    primaryColor: "brand", // should be used once we've converted to mantine
    colors: {
      brand: [
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
        "#2cd3b5",
      ],
    },
  });
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
