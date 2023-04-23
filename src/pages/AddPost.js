/* eslint-disable camelcase */
// ----------------------------------------------------------------------
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// material
import { Typography, Container, Stack, Button, TextField, FormControl} from '@mui/material';

import axios from 'axios';
import Page from '../components/Page';


// ----------------------------------------------------------------------
export default function Post() {
  
  const navigate = useNavigate();
  
  const [title, setTitle]= useState('');

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
  const value = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
 
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const data = {
      title, 
      konten : value
    }
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/post`, data);
      navigate('/dashboard/post', { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Page title="Add Post">
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
              onChange={(e) => {setTitle(e.target.value)}}
            />
            <div>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}
              />
            </div>
            <Button variant="contained" type="submit" onClick={handleSubmitCreate}>Publish</Button>
          </FormControl>
        </Stack>
      </Container>
    </Page>
  );
}
