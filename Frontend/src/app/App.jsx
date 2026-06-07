import './App.css'
import { RouterProvider } from 'react-router'
import routes from './app.routes'
import { useEffect } from 'react'
import socketService from '../services/socketService'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { logout } from '../features/auth/state/authSlice'
import { Toaster } from 'react-hot-toast'


function App() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  useEffect(() => {
    // Global Axios Interceptor to catch 401 Unauthorized errors
    // If the token expires or is missing, this logs the user out and navigates back to login.
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch])

  useEffect(() => {
    // Initialize WebSocket when user is authenticated
    if (user) {
      socketService.connect()
    }

    return () => {
      // Cleanup WebSocket on unmount
      socketService.disconnect()
    }
  }, [user])

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={routes} />
    </>
  )
}

export default App
