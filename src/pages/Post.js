/* eslint-disable camelcase */
// ----------------------------------------------------------------------
import React, {  useEffect, useState } from "react";
import { Link as RouterLink} from 'react-router-dom';

import Moment from "moment";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
  Link,
  Modal,
  TextField,
  Box,
  FormControl
} from '@mui/material';

//
import axios from 'axios';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';


// components
const styleform = {
  flexDirection: 'row',
  justifyContent: 'spaceBeetwen'
};
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
export default function Post() {

  const [posts, setPosts] = useState('');
  const [user, setUser]   = useState('');

  const [openDel, setOpenDel]       = useState(false);
  const [id, setId]                 = useState('');
  const [title, setTitle]           = useState('');
  const [created, setCreated]       = useState('');
  const [createdEnd, setCreatedEnd] = useState('');

  // GET DATA POST BY DATE
  const getPostDataByDate = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/post/${created}/${createdEnd}`).then((response) => {
      setPosts(response.data);
    });
  }

  const SubmitFilter = () => { 
    getPostDataByDate()
  }

  // GET DATA POST SEMUA
  const getPostData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/api/post`).then((response) => {
      setPosts(response.data);
    });
  }

  const ResetFilter = () => { 
    getPostData()
  }

  useEffect(() => {
    getPostData()
  }, [])

  // localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  //
  const handleOpenModalDelete  = (e) => {
    setId(e.target.getAttribute("data-id"))
    setTitle(e.target.getAttribute("data-title"))
    setOpenDel(true);
  }
  const handleCloseModalDelete = () => setOpenDel(false);
  const handleSubmitDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_BASE_URL}/api/post/${id}`).then(() => {
      getPostData()
    })
    setOpenDel(false)
  }

  let button;
  if (user && user.role === 'Admin') {
    button = <Button variant="contained" component={RouterLink} to="/Dashboard/AddPost" startIcon={<Iconify icon="eva:plus-fill" />}>
                New Post
             </Button>
  }

  // Cek loggedin user admin
  const isUserAdmin = user.role === 'Admin';

  return (
    <Page title="Post">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Posts
          </Typography>
          {button}
        </Stack>
        <Stack direction="row" mb={2}>
          <FormControl sx={styleform}>
            <TextField
              type="date"
              size="small"
              value={created}
              onChange={(e) => {
                setCreated(e.target.value)
              }} 
              sx={{ width: 150, mr:1 }}
            />
            <TextField
              type="date"
              size="small"
              value={createdEnd}
              onChange={(e) => {
                setCreatedEnd(e.target.value)
              }} 
              sx={{ width: 150, mr:1 }}
            />
            <Button variant="contained" size="small" sx={{ ml: 1, mt: 1 }} type="submit" onClick={SubmitFilter}>Filter </Button>
            <Button variant="contained" size="small" sx={{ ml: 1, mt: 1 }} type="submit" onClick={ResetFilter} >Reset </Button>
          </FormControl>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>TITLE</TableCell>
                    <TableCell>CREATED AT</TableCell>
                    {isUserAdmin && (
                    <TableCell>ACTION</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(posts)
                  ? posts.map(post => ( 
                  <TableRow
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    key={post.id}
                  >
                    <TableCell align="center" component="td" >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Link href={`/dashboard/postDetail/${post.slug}`}>
                          <Typography variant="subtitle2" noWrap>
                            {post.title} 
                          </Typography>
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell align="left" component="td" >
                        <Typography variant="subtitle2" noWrap>
                          {post.created} 
                        </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={2}>
                      {isUserAdmin && (
                        <Button variant="contained" component={RouterLink} to={`/dashboard/updatepost/${post.slug}`}  color="success" size="small" startIcon={<Iconify icon="eva:pencil-fill"/> } >
                          Update
                        </Button> 
                      )}
                      {isUserAdmin && (
                        <Button variant="contained" color="error" size="small" startIcon={<Iconify icon="eva:trash-fill"/> }  
                          data-title={post.title} 
                          data-id={post.id}  
                          onClick={handleOpenModalDelete} > 
                          Delete
                        </Button> 
                      )}
                      </Stack> 
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
            open={openDel}
            onClose={handleCloseModalDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                Delete {title} ?
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
