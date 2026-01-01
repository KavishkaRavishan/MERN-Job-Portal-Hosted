import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import CreateJob from "../Pages/CreateJob";
import MyJobs from "../Pages/MyJobs";
import UpdateJob from "../Pages/UpdateJob";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import JobDetails from "../Pages/JobDetails";
import JobApplications from "../Pages/JobApplications";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { 
        path: "/post-job", 
        element: (
          <ProtectedRoute>
            <CreateJob />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/my-job", 
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/job-applications", 
        element: (
          <ProtectedRoute>
            <JobApplications />
          </ProtectedRoute>
        ) 
      },
      {
        path: "/my-job/edit-job/:id",
        element: (
          <ProtectedRoute>
            <UpdateJob />
          </ProtectedRoute>
        ),
        loader: ({ params }) => {
          const url = `/all-jobs/${params.id}`;
          return fetch(url).then((res) => res.json());
        },
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/job/:id",
        element: <JobDetails />,
        loader: ({ params }) => {
          const url = `/all-jobs/${params.id}`;
          return fetch(url).then((res) => res.json());
        },
      },
    ],
  },
]);

export default router;
