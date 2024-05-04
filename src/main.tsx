import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { AuthLocalStorage, store, useAppDispatch, useAppSelector } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { LOCAL_STORAGE_AUTH } from './common/constants.ts'
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
} from 'react-router-dom'
import { logout } from './store/authSlice.ts'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import { Home } from './pages/Home.tsx'
// import { Table } from './components/Table/Table.tsx'

let persistor = persistStore(store)
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Home = lazy(() => import('./pages/Home'))

const Loading: React.FC = () => {
  return <h2>🌀 Loading...</h2>
}
const ProtectedRoute: React.FC = () => {
  // const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const auth = localStorage[LOCAL_STORAGE_AUTH] ? JSON.parse(localStorage[LOCAL_STORAGE_AUTH]) as AuthLocalStorage : null
  const location = useLocation()
  if (auth && auth.accessTokenExpiry * 1000 < Date.now()) {
    dispatch(logout())
    return <Navigate to={'/login'} state={{ from: location }} replace />
  }
  // TODO: check both role && permissions
  return !!auth ? (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to={'/login'} state={{ from: location }} replace />
  )
}

const PublicRoute: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PublicRoute />}>
        <Route index={true} path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> // TODO: handle register even when user logged in
      </Route>
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </React.StrictMode>
  </Provider>
)
