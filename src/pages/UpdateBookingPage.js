/* eslint-disable camelcase */
/* eslint no-self-compare: "error" */
import React, { useState,useEffect } from "react";
// Moment Libs
import dayjs from 'dayjs';
import 'dayjs/locale/id';
// material
import {
  Stack, TextField,
  Typography,
  Modal,
  FormControl,
  Button,
  Box
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
// Axious
import axios from 'axios';

const locales = ['en', 'id'];

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
// ----------------------------------------------------------------------
export default function UpdateBookingPage() {
  
  const [openUpdTime, setOpenUpdTime] = useState(false);
  const [time_start, setTmStart]    = useState(null);
  const [locale, setLocale]       = useState('id');
  const [bookings, setBookings]   = useState(null);

  // GET DATA BOOKING ALL
  const getBookingData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/24`).then((response) => {
      setBookings(response.data);
    });
  }

  useEffect(() => {
    getBookingData()
  }, [])

  // UPDATE DATA SCHEDULE OLEH ADMIN 
  const CloseModalUpdTime = () => setOpenUpdTime(false);
  const handleOpenModalUpdateTime  = (e) => {
    setTmStart(e.target.getAttribute("data-time_start"))
    setOpenUpdTime(true);
  }
  const SubmitUpdateTime = (e) => {
    e.preventDefault();
    const data = {
      time_start: "13:45"
    }
    const booking_id = 24
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateSchedule/${booking_id}`,data).then((response) => {
      console.log(response)
      getBookingData()
      setOpenUpdTime(false)
    });
  }
  // END
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {Array.isArray(bookings)
      ? bookings.map(booking => ( 
      <Stack spacing={3}>
        <TimePicker
          ampm={false}
          value={booking.time_start}
          onChange={(newValue) => {
            console.log(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <Button variant="contained" color="success" size="small" sx={{margin:1}}  
            data-time_start={booking.time_start}  
            onClick={handleOpenModalUpdateTime}> 
            Update Times
        </Button>
        <TextField
          required
          type="text"
          margin="normal"
          value={booking.time_start}
        />
      </Stack>
    )) : null} 
      <div>
        <Modal
          open={openUpdTime}
          onClose={CloseModalUpdTime}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
              Update Times
            </Typography>
            <FormControl fullWidth >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker 
                label="Time Start"
                ampm={false}
                value={time_start}
                onChange={(newValue) => {
                  setTmStart(newValue)
                }}
                renderInput={(params) => (
                  <TextField {...params} />
                )}
                />
              </LocalizationProvider>
              <Button variant="contained" type="submit" onClick={SubmitUpdateTime}>Update Times</Button>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
}
