import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Stack, IconButton, InputAdornment,Card, Link, Container, Typography, FormControl, TextField, Button } from '@mui/material';

// @mui
import { styled } from '@mui/material/styles';
// components
import axios from 'axios';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Logo from '../components/Logo'
// hooks
import useResponsive from '../hooks/useResponsive';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
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

export default function Login() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser]         = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser  = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, [process.env.REACT_APP_BASE_URL, email]);

  if(user){
    console.log('ada');
    navigate('/dashboard/app', { replace: true });
  }

  // login the user
  const handleSubmit = async e => {
    e.preventDefault();
    const data = { email, password };
    // send the email and password to the server
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, data
      ).then(res => {
        navigate('/dashboard/app', { replace: true });
        // set the state of the user
        setUser(res.data);
        // store the user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));
      }).catch((error) => {
        if (error.res) {
          console.log(error.res.status);
        }
        setOpenAlert(true)
      });
  };
  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in to Booking Room
            </Typography>

            { user ? (
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below. {user.id}</Typography>
            ) : (  
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>
            )}

            <FormControl fullWidth >
              <Collapse in={openAlert}>
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  Login Details Incorrect. Please try again.
                </Alert>
              </Collapse>

              <TextField required id="outlined-required email" margin="normal" label="Email"  name="email" 
                value={email} 
                onChange={(e) => {setEmail(e.target.value)}} 
              />
              <TextField required id="outlined-required password" margin="normal" label="Password"  name="password" 
                value={password} onChange={(e) => {setPassword(e.target.value)}}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }} 
              />

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Link variant="subtitle2" underline="hover" component={RouterLink} to="/ForgotPassword">
                  Forgot password?
                </Link>
              </Stack>

              <Button variant="contained" type="submit" onClick={handleSubmit}>Login</Button>
            </FormControl>
            
            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
