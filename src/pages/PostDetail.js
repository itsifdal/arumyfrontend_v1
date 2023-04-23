/* eslint-disable */
import { useParams,  Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactWhatsapp from 'react-whatsapp';
// @mui
import { Stack, IconButton, Card, Link, CardHeader,Container, Typography, Button } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
// @mui
import { styled } from '@mui/material/styles';
// components
import axios from 'axios';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function PostDetail() {
  const navigate = useNavigate();
  const [number, setNumber] = useState('');
  const [posts, setPosts]= useState('');

  let {slug} = useParams()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/post/${slug}`).then((response) => {
      setPosts(response.data);
    });
  }, [])

  return (
    <Page title="Post Detail">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          { Array.isArray(posts) ? posts.map(post => ( 
            <Typography variant="h4" gutterBottom>
              {post.title} 
            </Typography>
          )) : ''}
          <Button variant="contained" component={RouterLink} to="/dashboard/post">
            Kembali
          </Button>
        </Stack>
        <Card>
          <CardContent>
            { Array.isArray(posts) ? posts.map(post => ( 
              <>
              <Typography variant="body2" color="text.secondary">
                {post.konten} 
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5}>
                <TextField id="standard-basic" label="Nomor Whatsapp" variant="standard" value={number} onChange={e => setNumber(e.target.value)} />
                <ReactWhatsapp number={number} message={post.konten}>
                  <Button variant="contained" mt={5}>
                    Share Now
                  </Button>
                </ReactWhatsapp>
              </Stack>
              </>
            )) : ''}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
