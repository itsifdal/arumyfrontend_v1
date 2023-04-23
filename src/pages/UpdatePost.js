/* eslint-disable camelcase */
/* eslint no-plusplus: "error" */
// ----------------------------------------------------------------------
import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// material
import { Typography, Container, Stack, Button, TextField, FormControl} from '@mui/material';

import axios from 'axios';
import Page from '../components/Page';

// ----------------------------------------------------------------------
export default function UpdatePost() {
  
  const navigate = useNavigate();
  const {slug} = useParams()

  const [id, setId]          = useState('');
  const [title, setTitle]    = useState('');
  const [konten, setKontens] = useState('');

  const regex = konten.replace(/<[^>]*>/g, '')

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/post/${slug}`).then((response) => {
      setKontens(response.data[0].konten)
      setTitle(response.data[0].title)
      setId(response.data[0].id)
    });
  }, [])

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const data = {
      title, 
      konten : regex
    }
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/api/post/${id}`, data);
      navigate('/dashboard/post', { replace: true });
    } catch (error) {
      console.log(error);
    }
    // console.log(data)
  }

  return (
    <Page title="Update Post">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Posts
          </Typography>
          <Button variant="contained" component={RouterLink} to="/dashboard/post" >
            Kembali
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <FormControl fullWidth >
            <TextField required id="outlined-required title" margin="normal" label="title"  
              name="title" 
              value={title}
              onChange={(e) => {setTitle(e.target.value)}}
            />
            <ReactQuill theme="snow" value={konten} onChange={(newValue) => {setKontens(newValue)}} />
            <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Publish</Button>
          </FormControl>
        </Stack>
      </Container>
    </Page>
  );
}
