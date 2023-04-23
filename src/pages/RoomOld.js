import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";

// material
import {
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
// ----------------------------------------------------------------------
export default function Room(props) {

  const [rooms, setRooms, roomId, roomCode, roomName, meetingCategory] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Mengambil value dari inputan
  const handleInputChange = (e) =>{
    props({[e.target.name]: e.target.value})
  }

  useEffect(() => {
    axios.get(`https://api.arumy.quatroacademy.com/api/room`).then((response) => {
      setRooms(response.data);
    });
  }, []);

  console.table(rooms);

  return (
    <Page title="Room">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Room 
          </Typography>
          <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Room
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ROOM NAME</TableCell>
                    <TableCell>ROOM CODE</TableCell>
                    <TableCell>MEETING CATEGORY</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {Array.isArray(rooms)
                  ? rooms.map(room => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={room.room_id}
                  >
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {room.room_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{room.room_code} </TableCell>
                    <TableCell align="left">{room.meeting_category}</TableCell>
                    <TableCell align="left">{room.meeting_category}</TableCell>
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
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Room
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required" margin="normal" label="Room Code"  name="room_code" onChange={handleInputChange(e)} />
                <TextField required id="outlined-required" margin="normal" label="Room Name"  name="room_name" onChange={handleInputChange(e)} />
                <TextField
                  id="demo-simple-select-standard"
                  margin="normal"
                  value
                  name="meeting_category"
                  onChange={handleInputChange(e)}
                  select label="Meeting Category"
                >
                  <MenuItem value={"Privat"}>Privat</MenuItem>
                  <MenuItem value={"Reguler"}>Reguler</MenuItem>
                </TextField>
                <Button variant="contained" type="submit" onClick>Save</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
