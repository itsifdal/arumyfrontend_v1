/* eslint-disable camelcase */
// import { Link as RouterLink } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import React, { useEffect,useState } from "react";

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

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
  Box
} from '@mui/material';

// components
import axios from 'axios';
import Page from '../components/Page';
import Label from '../components/Label';
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
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

// ----------------------------------------------------------------------
export default function User() {

  //
  const [users, setUsers] = useState('');
  const [id, setUserId]   = useState('');
  const [name, setName]   = useState('');
  const [role, setRole]   = useState('');
  const [email_, setEmail_] = useState('');
  const [password_, setPassword_]   = useState('');

  //
  const [open, setOpen]  = useState(false);
  const [openDel, setOpenDel]  = useState(false);
  
  // fetch api
  const getUserData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user`).then((response) => {
      setUsers(response.data);
    });
  }

  useEffect(() => {
    getUserData()
  }, [])

  const data = {
    role,
    name,
    email:email_, 
    password:password_
  }

  // Create
  const handleOpenModalCreate  = () => setOpen(true);
  const handleCloseModalCreate = () => setOpen(false);
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/user`, data).then((response) => {
      getUserData()
      setOpen(false)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
    setName('');
    setRole('');
    setEmail_('');
    setPassword_('');
  }

  // Delete
  const handleOpenModalDelete  = (e) => {
    setUserId(e.target.getAttribute("data-id"))
    setName(e.target.getAttribute("data-name"))
    setOpenDel(true);
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`).then((response) => {
      getUserData()
      setOpenDel(false)
      toast.warning(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        theme: "colored",
      });
    });
  }

  return (
    <Page title="Users">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users 
          </Typography>
          <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill"/>} onClick={handleOpenModalCreate}>
            New User
          </Button>
        </Stack>
        <ToastContainer pauseOnFocusLoss={false}/>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>ROLE</TableCell>
                    <TableCell>NAMA USER</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {Array.isArray(users)
                  ? users.map(user => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={user.id}
                  >
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">
                      <Label variant="ghost" color={(user.role === 'admin' && 'success') || 'warning'}>
                        {sentenceCase(user.role)}
                      </Label>
                    </TableCell>
                    <TableCell align="left" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {user.name} 
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">
                      <Button variant="contained" color="error" size="small" margin={2} startIcon={<Iconify icon="eva:trash-fill"/> } 
                        data-name={user.name} 
                        data-id={user.id}  
                        onClick={handleOpenModalDelete}> 
                        Delete
                      </Button>
                      </TableCell>
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
                Create User
              </Typography>
              <FormControl fullWidth >
                <TextField required id="outlined-required name"  margin="normal" label="User Name"  name="name" value={name} onChange={(e) => {setName(e.target.value)}} />
                <TextField required id="outlined-required email" margin="normal" label="Email"  name="email" type="email" value={email_} onChange={(e) => {setEmail_(e.target.value)}} />
                <TextField required id="outlined-required pass" margin="normal" label="Password"  name="pass" type="password" value={password_} onChange={(e) => {setPassword_(e.target.value)}} />
                <TextField
                  id="demo-simple-select-standard"
                  margin="normal"
                  name="role"
                  value={role} onChange={(e) => {setRole(e.target.value)}}
                  select label="Role"
                >
                  <MenuItem value={role} >Select</MenuItem>
                  <MenuItem value={"Guru"} >Guru</MenuItem>
                  <MenuItem value={"Reguler"}>Reguler</MenuItem>
                </TextField>
                <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Save</Button>
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
                Delete {name} ?
              </Typography>
              <FormControl fullWidth >
                <Button variant="contained" type="submit" onClick={handleSubmitDelete}>Delete</Button>
              </FormControl>
            </Box>
          </Modal>
        </div>
      </Container>
    </Page>
  );
}
