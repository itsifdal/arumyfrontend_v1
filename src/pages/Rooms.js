/* eslint-disable camelcase */
// ----------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import Moment from 'moment';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// material
import { Typography, Container, Stack, Button, TextField, Modal, FormControl,Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//
import axios from 'axios';
import Page from '../components/Page';
import Iconify from '../components/Iconify';


// components
// Style box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Swal = require('sweetalert2')
// ----------------------------------------------------------------------
export default function Blog() {

  const [id, setId]= useState('');
  const [rooms, setRooms]= useState('');
  const [user, setUser] = useState('');
  const [meeting_name, setMeetingName] = useState('');
  const [dt, setDate]  = useState(null);
  const [tm_start, setTmStart] = useState('');
  const [tm_end, setTmEnd] = useState('');

  const [open, setOpen]  = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
      setRooms(response.data);
    });
  }, [])

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const userId = user.id;

  const booking_date = Moment(new Date(dt)).format('YYYY-MM-DD');
  const time_start   = Moment(new Date(tm_start)).format("H:mm:ss");
  const time_end     = Moment(new Date(tm_end)).format("H:mm:ss");

  const handleCloseModalCreate = () => setOpen(false);
  const handleOpenModalCreate = (e) => {
    setId(e.target.getAttribute("data-id"))
    setOpen(true);
  }
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      userId, roomId : id, meeting_name, booking_date, time_start, time_end
    }
    console.table(data);
    if (time_start < "7.00.00" || time_end > "16.00.00") {
      Swal.fire({
        title: 'Invalid Schedule!',
        text: 'Booking Kelas berlaku pada jam 07.00 - 16.00',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }else{
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data)
        .then((response) => {
            if (response.data.message === "Invalid Request, Schedule Same") {
              Swal.fire({
                title: 'Invalid Schedule!',
                text: 'Kelas telah dibooking Pada jam yang sama',
                icon: 'error',
                confirmButtonText: 'Close'
              })
            } else {
              Swal.fire({
                title: 'Valid Request!',
                text: 'Sukses Booking Ruangan ',
                icon: 'success',
                confirmButtonText: 'Close'
              })
            }
        })
    }
    setOpen(false)
  }

  return (
    <Page title="Rooms">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Rooms
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button>
        </Stack>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.isArray(rooms)
                  ? rooms.map(room => ( 
            <Grid item xs={2} sm={4} md={4} key={room.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="bookingroom-frontend/src/pages/solidbg.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {room.room_name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                  size="small"
                  data-id={room.id}
                  onClick={handleOpenModalCreate}
                  >Pilih</Button>
                </CardActions>
              </Card>
            </Grid>
          )) : ''}
        </Grid>
        <div>
          <Modal
            open={open}
            onClose={handleCloseModalCreate}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create Booking Data
              </Typography>
              <FormControl fullWidth >
                <TextField 
                    required 
                    id="outlined-required" 
                    margin="normal" 
                    label="Meeting Name"  
                    name="meeting_name" 
                    value={meeting_name} 
                    onChange={(e) => {
                      setMeetingName(e.target.value)
                    }} 
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={dt}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} margin="normal" />}
                  />
                  <TimePicker
                    label="Time Start"
                    value={tm_start}
                    onChange={(newValue) => {
                      setTmStart(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} margin="normal" />}
                  />
                  <TimePicker
                    label="Time End"
                    value={tm_end}
                    onChange={(newValue) => {
                      setTmEnd(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} margin="normal" />}
                  />
                </LocalizationProvider>
                <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Save</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
