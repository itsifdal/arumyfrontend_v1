import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import Button from '@mui/material/Button';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';



// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const defaultValues = {
    email: '',
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
    console.log(email)
    const data = {
      email, password
    }
    axios.post('http://localhost:8080/api/login', data)
      .then(res => {
        if (res.statusText === "OK") {
          navigate('/dashboard/room', { replace: true });
          console.log(res.statusText)
        } else {
          setOpen(true)
          console.log(open)
          console.log(res);
          console.log(res.data);
        }
      })
    
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" value={email} onChange={(e) => {setEmail(e.target.value)}} />

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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
