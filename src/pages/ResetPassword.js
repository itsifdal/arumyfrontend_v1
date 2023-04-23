/* eslint-disable */
import { useParams,  Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, IconButton, InputAdornment, Card, Link, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @mui
import { styled } from '@mui/material/styles';
// components
import axios from 'axios';
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Logo from '../components/Logo'
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
// hooks
import useResponsive from '../hooks/useResponsive';
// sections
import { FormProvider, RHFTextField } from '../components/hook-form';

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

export default function ForgotPassword() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  let {token} = useParams()

  const [openAlert, setOpenAlert]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword]         = useState('');
  
  const defaultValues = {
    password: '',
    remember: true,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = () => {
    console.log(token)
    const data = {
      password
    }
    axios.post(`${process.env.REACT_APP_BASE_URL}/api/resetpassword/${token}`, data)
      .then(res => {
        if (res.statusText === 'OK') {
          //navigate('/login', { replace: true });
          setOpenAlert(true)
        }
        console.log(res);
        console.log(res.data); 
      }).catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
        } else if (error.request) {
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    
  };

  return (
    <Page title="Reset Password">
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Reset Password
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Update Password 
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter new password below.</Typography>
            <Collapse in={openAlert}>
              <Alert
                severity="success"
                sx={{ mb: 2 }}
              >
                <Typography variant="body2">
                  Reset Password berhasil,
                  <Link variant="subtitle2" component={RouterLink} to="/login">
                    Silahkan Login Kembali
                  </Link>
                </Typography>
              </Alert>
            </Collapse>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} sx={{mb:2}} >
                <RHFTextField
                  name="password"
                  label="Password"
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
              </Stack>

              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                Update Password
              </LoadingButton>
            </FormProvider>

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
