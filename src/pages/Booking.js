/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// Moment Libs
import Moment from 'moment';
// Date Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, DatePicker } from '@mui/x-date-pickers/';
// React Toasts 
import { ToastContainer, toast } from 'react-toastify';

// Toastify
import 'react-toastify/dist/ReactToastify.css';

// material
import {
  Badge,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Modal,
  FormControl,
  TextField,
  MenuItem,
  Box
} from '@mui/material';

// components
import axios from 'axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';

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
export default function Booking() {
  const [bookings, setBookings]         = useState('');
  const [booking_id, setBookingId]      = useState('');

  const [rooms, setRooms]               = useState('');
  const [roomId, setRoomId]             = useState('');

  const [user, setUser]                 = useState('');
  const [meeting_name, setMeetingName]  = useState('');
  const [jenisKelas, setJenisKelas]     = useState('');
  const [statusKelas, setStatusKelas]   = useState('');
  const [dt, setDate]                   = useState(null);
  const [tm_start, setTmStart]          = useState(null);
  const [tm_end, setTmEnd]              = useState(null);

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const userId = user.id;

  // range dates
  const [rangeAwal, setRangeAwal]       = useState('');
  const [rangeAkhir, setRangeAkhir]     = useState('');

  const tmstr  = Moment(tm_start, 'HH:mm:ss').format('HH:mm')
  const tmend  = Moment(tm_end, 'HH:mm:ss').format('HH:mm')

  const [open, setOpen]  = useState(false);
  const [openDel, setOpenDel]  = useState(false);
  const [openUpdateData, setOpenUpdateData]   = useState(false);
  const [openUpdTime, setOpenUpdTime]         = useState(false);
  const [openUpdStatus, setOpenUpdStatus]     = useState(false);

  const handleChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleChangeJenis = (e) => {
    setJenisKelas(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setStatusKelas(e.target.value);
  };

  // Get Room Data
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/room`).then((response) => {
        setRooms(response.data);
    });
  }, []);

  // GET DATA BOOKING BY FILTER PARAMETERS
  const getBookingByFilter = () => {
    const data = {
      status : statusKelas, rangeAwal, rangeAkhir
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking/filter/default`, data).then((response) => {
      setBookings(response.data);
    });
  }

  const SubmitFilter = () => { 
    getBookingByFilter()
    // getBookingByStatus()
    // getBookingByDateRange()
  }

  // GET DATA BOOKING ALL
  const getBookingData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking`).then((response) => {
      setBookings(response.data);
    });
  }

  const ResetFilter = () => { 
    getBookingData()
  }

  useEffect(() => {
    getBookingData()
  }, [])


  //----
  const handleOpenModalCreate  = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const data = {
      userId, roomId, meeting_name, kategori : jenisKelas, booking_date : dt, time_start: tmstr, time_end: tmend, status : 'pending'
    }
    console.log(data)
    if (tm_start < tmstr || tm_end > tmend) {
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking`, data)
      // Swal.fire({
      //   title: 'Invalid Schedule!',
      //   text: 'Booking Kelas berlaku pada jam 07.00 - 16.00',
      //   icon: 'error',
      //   confirmButtonText: 'Close'
      // })
    }
    else{
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
              getBookingData()
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

  // Open Modal Delete
  const handleOpenModalDelete  = (e) => {
    setBookingId(e.target.getAttribute("data-id"))
    setMeetingName(e.target.getAttribute("data-meeting_name"))
    setOpenDel(true);
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/booking/${booking_id}`).then((response) => {
      getBookingData()
      setOpenDel(false)
      toast.warning(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  }

  // UPDATE DATA BOOKING SEMUA OLEH ADMIN 
  const CloseModalUpdateData = () => setOpenUpdateData(false);
  const handleOpenModalUpdateSchedule  = (e) => {
    setBookingId(e.target.getAttribute("data-id"))
    setRoomId(e.target.getAttribute("data-room_id"))
    setMeetingName(e.target.getAttribute("data-meeting_name"))
    setJenisKelas(e.target.getAttribute("data-jenis_kelas"))
    setDate(e.target.getAttribute("data-booking_date"))
    setTmStart(e.target.getAttribute("data-time_start"))
    setTmEnd(e.target.getAttribute("data-time_end"))
    setOpenUpdateData(true);
  }
  const SubmitUpdateData = (e) => {
    e.preventDefault();
    const data = {
      meeting_name, roomId, kategori : jenisKelas, booking_date : dt, time_start : tmstr, time_end : tmend
    }
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/${booking_id}`, data).then((response) => {
      getBookingData()
      setOpenUpdateData(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  }
  // END

  // UPDATE DATA SCHEDULE OLEH ADMIN 
  const CloseModalUpdTime = () => setOpenUpdTime(false);
  const handleOpenModalUpdateTime  = (e) => {
    setTmStart(e.target.getAttribute("data-time_start"))
    setTmEnd(e.target.getAttribute("data-time_end"))
    setBookingId(e.target.getAttribute("data-id"))
    setOpenUpdTime(true);
  }
  const SubmitUpdateTime = (e) => {
    e.preventDefault();
    const data = {
      time_start: tmstr, time_end: tmend
    }
    console.log(data);
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateSchedule/${booking_id}`, data).then((response) => {
      getBookingData()
      setOpenUpdTime(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  }
  // END

  // Open Modal Update Confirm 
  const handleOpenModalUpdateStatus  = (e) => {
    setBookingId(e.target.getAttribute("data-id"))
    setMeetingName(e.target.getAttribute("data-meeting_name"))
    setOpenUpdStatus(true);
  }
  const handleCloseModalUpdateStatus = () => setOpenUpdStatus(false);
  const handleSubmitUpdStatus = (e) => {
    e.preventDefault();
    const data = {
      status : statusKelas
    }
    axios.put(`${process.env.REACT_APP_BASE_URL}/api/booking/updateStatus/${booking_id}`, data).then((response) => {
      getBookingData()
      setOpenUpdStatus(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  }

  let button;
  if (user && user.role === 'Admin') {
    button = <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleOpenModalCreate}>
              New Booking
            </Button>
  }

  // Cek loggedin user admin
  const isUserAdmin = user.role === 'Admin';
  const isUserGuru  = user.role === 'Guru';

  const navigate = useNavigate();

  const MoveToUpdatePage = (e) => {
    setBookingId(e.target.getAttribute("data-id"))
    console.log(booking_id)
    navigate(`/dashboard/UpdateBookingPage/24`);
  };

  //----
  return (
    <Page title="Booking">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bookings
          </Typography>
          {button}
        </Stack>
        <ToastContainer pauseOnFocusLoss={false}/>
        <FormControl sx={{ display: 'inline' }}>
          <TextField
            select
            id="demo-simple-select"
            size="small"
            label="Status Kelas"
            value={statusKelas}
            onChange={handleChangeStatus}
            sx={{
              width: 150,
              mr:1
            }}
          >
            <MenuItem value={"Status Kelas"} >Status</MenuItem>
            <MenuItem value={"pending"}>
              Pending
            </MenuItem>
            <MenuItem value={"confirmed"}>
              Confirmed
            </MenuItem>
          </TextField>
          <TextField
            type="date"
            size="small"
            value={rangeAwal}
            onChange={(e) => {
              setRangeAwal(e.target.value)
            }} 
            sx={{
              width: 150,
              mr:1
            }}
          />
          <TextField
            type="date"
            size="small"
            value={rangeAkhir}
            onChange={(e) => {
              setRangeAkhir(e.target.value)
            }} 
            sx={{
              width: 150,
              mr:1
            }}
          />
          <Button variant="contained" size="small" sx={{ width: 30, ml: 1, mt: 1 }} type="submit" onClick={SubmitFilter}>Filter </Button>
          <Button variant="contained" size="small" sx={{ width: 30, ml: 1, mt: 1 }} type="submit" onClick={ResetFilter} >Reset </Button>
        </FormControl>
        <Card sx={{ mt: 5 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ROOM</TableCell>
                    <TableCell>BOOKED BY</TableCell>
                    <TableCell>CLASS NAME</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>DATE</TableCell>
                    <TableCell>TIME START</TableCell>
                    <TableCell>TIME END</TableCell>
                    {isUserAdmin && (
                    <TableCell>ACTION</TableCell>
                    )}
                    {isUserGuru && (
                    <>
                    <TableCell>MORE</TableCell>
                    </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(bookings.data)
                  ? bookings.data.map(booking => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={booking.booking_id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {booking.room.room_name} | {booking.kategori} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{booking.user.name} </TableCell>
                    <TableCell align="left">{booking.meeting_name} </TableCell>
                    <TableCell align="center">
                      {booking.status === 'pending' ? (
                        <Badge badgeContent={booking.status} color="warning" />
                      ):(
                        <Badge badgeContent={booking.status} color="success" />
                      )}
                    </TableCell>
                    <TableCell align="left">{Moment(booking.booking_date).format('DD MMMM, YYYY')}</TableCell>
                    <TableCell align="left">{booking.time_start}</TableCell>
                    <TableCell align="left">{booking.time_end}</TableCell>
                    {isUserAdmin && (
                    <TableCell align="left">
                      <Button variant="contained" color="success" size="small" sx={{margin:1}} startIcon={<Iconify icon="eva:pencil-fill"/> } 
                          data-room_id={booking.roomId}
                          data-jenis_kelas={booking.kategori} 
                          data-meeting_name={booking.meeting_name} 
                          data-booking_date={booking.booking_date}
                          data-time_start={booking.time_start}
                          data-time_end={booking.time_end}
                          data-id={booking.booking_id}  
                          onClick={handleOpenModalUpdateSchedule}> 
                          Update
                      </Button>
                      {/* <Button variant="contained" color="success" size="small" sx={{margin:1}} startIcon={<Iconify icon="eva:pencil-fill"/> } 
                          data-id={booking.booking_id}  
                          data-time_start={booking.time_start}
                          data-time_end={booking.time_end}
                          onClick={handleOpenModalUpdateTime}> 
                          Update Times
                      </Button> */}
                      <Button variant="contained" color="error" size="small" sx={{margin:1}}  startIcon={<Iconify icon="eva:trash-fill"/> } 
                          data-meeting_name={booking.meeting_name} 
                          data-id={booking.booking_id}  
                          onClick={handleOpenModalDelete}> 
                          Delete
                      </Button>
                    </TableCell>
                    )}
                    {isUserGuru && (
                    <>
                    <TableCell align="left">
                      <Button variant="contained" color="primary" size="small" margin="normal" startIcon={<Iconify icon="eva:pencil-fill"/> } 
                          data-meeting_name={booking.meeting_name} 
                          data-id={booking.booking_id}  
                          onClick={handleOpenModalUpdateStatus}> 
                          Confirm
                      </Button>
                    </TableCell>
                    </>
                    )}
                  </TableRow>
                  )) : null} 
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
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
                  onChange={(e) => {
                    setMeetingName(e.target.value)
                  }} 
                />
                <TextField
                  id="outlined-select-currency ruang"
                  select
                  margin="normal"
                  label="Ruang"
                  onChange={handleChange}
                >
                  <MenuItem value={"Ruang"} >- Ruangan -</MenuItem>
                  {Array.isArray(rooms)
                   ? rooms.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.room_name}
                    </MenuItem>
                  )):null}
                </TextField>
                <TextField
                  id="outlined-select-currency jenis"
                  select
                  margin="normal"
                  label="Jenis Kelas"
                  onChange={handleChangeJenis}
                >
                  <MenuItem value={"Jenis Kelas"} >Jenis kelas</MenuItem>
                  <MenuItem value={"Privat"}>
                    Privat
                  </MenuItem>
                  <MenuItem value={"Group"}>
                    Group
                  </MenuItem>
                </TextField>
                <TextField
                  required
                  type="date"
                  margin="normal"
                  onChange={(e) => {
                    setDate(e.target.value)
                  }} 
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker 
                  label="Time Start"
                  ampm={false}
                  margin="normal" 
                  value={tm_start}
                  onChange={(newValue) => {
                    setTmStart(newValue)
                  }}
                  renderInput={(props) => (
                    <TextField {...props} 
                    margin="normal"/>
                  )}
                  />
                  <TimePicker 
                  label="Time End"
                  ampm={false} 
                  value={tm_end}
                  onChange={(newValue) => {
                    setTmEnd(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    margin="normal"/>
                  )}
                  />
                </LocalizationProvider>
                <Button variant="contained"  type="submit" onClick={handleSubmitCreate}>Save</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openDel}
            onClose={handleCloseModalDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Delete {meeting_name} ?
              </Typography>
              <FormControl fullWidth >
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>Delete</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openUpdStatus}
            onClose={handleCloseModalUpdateStatus}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Update {meeting_name} data ?
              </Typography>
              <FormControl fullWidth >
              <TextField
                  id="outlined-select-currency jenis"
                  select
                  margin="normal"
                  label="Status Kelas"
                  value={statusKelas}
                  onChange={handleChangeStatus}
                >
                  <MenuItem value={"Jenis Kelas"} >Jenis kelas</MenuItem>
                  <MenuItem value={"Pending"}>
                    Pending
                  </MenuItem>
                  <MenuItem value={"Confirmed"}>
                    Confirmed
                  </MenuItem>
                </TextField>
                <Button variant="contained" type="submit" onClick={handleSubmitUpdStatus}>Submit</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
        <div>
          <Modal
            open={openUpdateData}
            onClose={CloseModalUpdateData}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Update Booking Data
              </Typography>
              <FormControl fullWidth >
                <TextField 
                    required 
                    id="outlined-required" 
                    margin="normal" 
                    size="small"
                    label="Meeting Name"  
                    name="meeting_name" 
                    value={meeting_name} 
                    onChange={(e) => {
                      setMeetingName(e.target.value)
                    }} 
                />
                <TextField
                  id="outlined-select-currency ruang"
                  select
                  margin="normal"
                  size="small"
                  label="Ruang"
                  value={roomId}
                  onChange={handleChange}
                >
                  <MenuItem value={"Ruang"} >- Ruangan -</MenuItem>
                  {Array.isArray(rooms)
                   ? rooms.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.room_name}
                    </MenuItem>
                  )):null}
                </TextField>
                <TextField
                  id="outlined-select-currency jenis"
                  select
                  margin="normal"
                  size="small"
                  label="Jenis Kelas"
                  value={jenisKelas}
                  onChange={handleChangeJenis}
                >
                  <MenuItem value={"Jenis Kelas"} >Jenis kelas</MenuItem>
                  <MenuItem value={"Privat"}>
                    Privat
                  </MenuItem>
                  <MenuItem value={"Group"}>
                    Group
                  </MenuItem>
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={dt}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} margin="normal" size="small"/>}
                  />
                  <TimePicker 
                  label="Time Start"
                  ampm={false}
                  margin="normal" 
                  format="hh:mm"
                  value={tmstr}
                  onChange={(newValue) => {
                    setTmStart(new Date(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    margin="normal"/>
                  )}
                  />
                  <TimePicker 
                  label="Time End"
                  ampm={false} 
                  value={tmend}
                  onChange={(newValue) => {
                    setTmEnd(new Date(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    margin="normal"/>
                  )}
                  />
                </LocalizationProvider>
                <Button variant="contained" type="submit" onClick={SubmitUpdateData}>Update</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
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
                  margin="normal" 
                  format="hh:mm"
                  value={tmstr}
                  onChange={(newValue) => {
                    setTmStart(new Date(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    margin="normal"/>
                  )}
                  />
                  <TimePicker 
                  label="Time End"
                  ampm={false} 
                  value={tmend}
                  onChange={(newValue) => {
                    setTmEnd(new Date(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} 
                    margin="normal"/>
                  )}
                  />
                </LocalizationProvider>
                <Button variant="contained" type="submit" onClick={SubmitUpdateTime}>Update Times</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
