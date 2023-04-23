import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Room from './pages/Room';
import Post from './pages/Post';
import PostDetail from './pages/PostDetail';
import AddPost from './pages/AddPost';
import UpdatePost from './pages/UpdatePost';
import Booking from './pages/Booking';
import UpdateBookingPage from './pages/UpdateBookingPage';

import Rooms from './pages/Rooms';
import User from './pages/User';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/Page404';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {

  return useRoutes([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'room', element: <Room /> },
        { path: 'booking', element: <Booking /> },
        { path: 'updateBookingPage/:id', element: <UpdateBookingPage /> },
        { path: 'post', element: <Post /> },
        { path: 'rooms', element: <Rooms /> },
        { path: 'addpost', element: <AddPost /> },
        { path: 'updatepost/:slug', element: <UpdatePost /> },
        { path: 'postdetail/:slug', element: <PostDetail /> }
      ],
    },
    {
      path: 'forgotpassword',
      element: <ForgotPassword />,
    },
    {
      path: 'resetpassword/:token',
      element: <ResetPassword />,
    },
    {
      path: 'postdetail/:slug',
      element: <PostDetail />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
