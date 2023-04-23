import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
// sections
import {
  AppWidgetSummary
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {

  const navigate = useNavigate();
  
  const [booking, setBooking] = useState('1');
  const [user, setUser] = useState('1');
  const [room, setRoom] = useState('1');
  const [post, setPost] = useState('1');


  const [foundUser, setFoundUser] = useState()
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser  = JSON.parse(loggedInUser);
      setFoundUser(foundUser);
    }
  }, []);

  if(!foundUser || foundUser === undefined) {
    navigate('/login', { replace: true });
  }

  // const [data, setData] = useState([]);

  // fetch response from server
  // const getData = async () => {
  //   await axios.get(process.env.REACT_APP_BASE_URL, { withCredentials: true }).then((response) => {
  //     setData(response.data);
  //   });
  // }

  // fetch bookings
  const getBookingCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/bookingCount`).then((response) => {
      setBooking(response.data);
    });
  }

  // fetch users
  const getUserCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/userCount`).then((response) => {
      setUser(response.data);
    });
  }

  // fetch rooms
  const getRoomCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/roomCount`).then((response) => {
      setRoom(response.data);
    });
  }

  // fetch posts
  const getPostCount = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/postCount`).then((response) => {
      setPost(response.data);
    });
  }

  useEffect(() => {
    getBookingCount();
    getUserCount();
    getRoomCount();
    getPostCount();
  }, [])

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Booking Aktif" total={booking.data} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="User" total={user.data} color="info" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Ruangan" total={room.data} color="warning" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Report" total={post.data} color="error" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
