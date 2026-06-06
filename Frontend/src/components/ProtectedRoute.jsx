import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../features/auth/hooks/useAuth';
import authService from '../features/auth/service/authService';
import { setUser, logout } from '../features/auth/state/authSlice';

// Status enum for verification lifecycle
const STATUS = {
  PENDING: 'pending',  // Haven't checked the server yet
  VERIFIED: 'verified', // Server confirmed the session is valid
  FAILED: 'failed',    // No valid session on the server
};

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Start as PENDING so we always check the server first.
  // This is the fix for incognito mode: localStorage may be empty but
  // the httpOnly cookie may still be valid from a previous session.
  const [status, setStatus] = useState(STATUS.PENDING);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        // Always hit the server — the httpOnly cookie is sent automatically
        const data = await authService.getMe();
        if (!isMounted) return;

        // If the server confirmed us, ensure Redux/localStorage are in sync
        if (data?.user) {
          dispatch(setUser(data.user));
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setStatus(STATUS.VERIFIED);
      } catch {
        if (!isMounted) return;
        // Server rejected the session (expired / invalid cookie / no cookie)
        dispatch(logout());
        localStorage.removeItem('user');
        setStatus(STATUS.FAILED);
      }
    };

    verifySession();

    return () => { isMounted = false; };
    // We intentionally run this ONCE on mount, not on every `user` change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⏳ Still waiting for server response — show spinner, do NOT redirect yet
  if (status === STATUS.PENDING) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #0f172a)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid rgba(99,102,241,0.3)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ❌ Verification failed — redirect to login
  if (status === STATUS.FAILED) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Session verified — render the protected content
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
