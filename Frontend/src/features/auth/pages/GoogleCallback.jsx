import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../state/authSlice';
import authService from '../service/authService';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getMe()
      .then(({ user }) => {
        dispatch(setUser(user));
        localStorage.setItem('user', JSON.stringify(user));
        navigate(user.role === 'admin' ? '/admin/monitors' : '/dashboard', { replace: true });
      })
      .catch(() => navigate('/login', { replace: true }));
  }, []);

  return (
    <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'4px solid rgba(99,102,241,0.3)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GoogleCallback;