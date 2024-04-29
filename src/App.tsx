import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom'
// import { Table } from './components/Table'
import { Home } from './pages/Home'
// import { Login } from './pages/Login'
// import { Register } from './pages/Register'
import { AuthLocalStorage, useAppDispatch, useAppSelector } from './store/store'
import  { Suspense, lazy } from 'react'
import { LOCAL_STORAGE_AUTH } from './common/constants';
import NavBar from 'components/NavBar';
import { setAuthToken } from './utils/setAuthToken';
import { logout } from './store/authSlice';
import { Container } from '@mui/material';


export default function App() {
  return (
    <>
    {/* <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index={true} path="/" element={<Home />} />
        <Route path="" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> // TODO: handle register even when user logged in
        </Route>
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/table" element={<Table />} />
        </Route>
      </Routes>
    </BrowserRouter> */}
      <NavBar />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </>
  )
}
