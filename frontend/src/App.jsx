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
import Login from "./features/Admins/auth/pages/Login";
import ProtectedRoute from "./helpers/protectedRoute";
import PageLayout from "./layout/layout";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import ElectionPage from "./features/Admins/elections/pages/ElectionPage";
import CandidatePageList from "./features/Admins/candidates/pages/CandidatePageList";
import GroupPageList from "./features/Admins/groups/pages/GroupPageList";
import Register from "./features/Admins/auth/pages/Register";
import VerifyUserEmail from "./features/Admins/auth/pages/VerifyUserEmail";
import UserList from "./features/Admins/users/pages/UserList";
import UserPermissionList from "./features/Admins/users/pages/UserPermissionList";
import { useDispatch } from "react-redux";
import { getUserPermissionFeatures } from "./actions/indexAction";
import VotingPage from "./features/Users/voting/pages/VotingPage";
import LandingPageLayout from "./layout/landingPageLayout";
import AboutPage from "./features/Users/about/AboutPage";
import Election from "./features/Users/voting/pages/Election";
import Candidate from "./features/Users/voting/pages/Candidate";
import Dashboard from "./features/Admins/dashboard/pages/Dashboard";
import Organisation from "./features/Admins/organisations/pages/Organisation";
import PositionPage from "./features/Users/voting/pages/PositionPage";
import ElectionResults from "./features/Users/voting/pages/ElectionResults";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
        currentLocation.pathname != "/login" &&
        currentLocation.pathname != "/register" &&
        !currentLocation.pathname.startsWith("/email/confirmation/")
      ) {
        navigate("/");
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("role")) {
      dispatch(getUserPermissionFeatures());
    }
  }, [dispatch, localStorage.getItem("role")]);

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
          path="/dashboard"
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
          path="/election/candidate"
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
          path="/symbol"
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
          path="/organisation"
          element={
            <ProtectedRoute>
              <PageLayout>
                <Organisation />
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

        <Route
          exact
          path="/"
          element={
            <LandingPageLayout>
              <VotingPage />
            </LandingPageLayout>
          }
        />

        <Route
          exact
          path="/about"
          element={
            <LandingPageLayout>
              <AboutPage />
            </LandingPageLayout>
          }
        />

        <Route
          exact
          path="/user/election"
          element={
            <LandingPageLayout>
              <Election />
            </LandingPageLayout>
          }
        />

        <Route
          exact
          path="/user/election/:electionId"
          element={
            <LandingPageLayout>
              <PositionPage />
            </LandingPageLayout>
          }
        />

        <Route
          exact
          path="/user/candidate/:electionId"
          element={
            <LandingPageLayout>
              <Candidate />
            </LandingPageLayout>
          }
        />
        <Route
          exact
          path="/user/results"
          element={
            <LandingPageLayout>
              <ElectionResults />
            </LandingPageLayout>
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
