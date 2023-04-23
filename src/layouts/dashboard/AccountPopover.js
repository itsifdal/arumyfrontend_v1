import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import axios from 'axios';
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [open, setOpen] = useState(null);
  
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  
  const navigate = useNavigate();

  const onLogout = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/api/login/logout`)
      .then(() => {
        localStorage.clear();
        navigate('/login', { replace: true });
      })
  };
  

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
            { user ? (
              <Typography variant="subtitle2" noWrap>{user.name}</Typography>
            ) : (  
              <Typography variant="subtitle2" noWrap> - </Typography>
            )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={onLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
