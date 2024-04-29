// import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
// import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
// import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
// import { LinkContainer } from 'react-router-bootstrap';
// TODO: make nav bar

// import { useSelector, useDispatch } from 'react-redux'
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material'
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/authSlice'
import { useAppSelector } from '../../store/store'
import { useAppDispatch } from '../../store/store'

export const NavBar = () => {
  const { user } = useAppSelector((state) => state.auth)
  console.log('🚀 ~ NavBar ~ user:', user)

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = () => {
    dispatch(logout())
    navigate('/')
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className='mb-2'>
          <Toolbar className='justify-between'>
            <div>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Button href='/' color="inherit">
              Flamme
            </Button>
            </div>
            <div>
            {!!user ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={logoutUser}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button href='/login' color="inherit">Login</Button>
            )}
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  )
}
