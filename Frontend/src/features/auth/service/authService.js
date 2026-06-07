import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password }, { withCredentials: true });
    return response.data;
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      return response.data;
    } catch {
      console.error('Logout error occurred');
      // Still consider logout successful even if request fails
      return { success: true };
    }
  },

  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forget-password`, { email }, { withCredentials: true });
    return response.data;
  },

  verifyOtp: async (otp) => {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { otp }, { withCredentials: true });
    return response.data;
  },

  resetPassword: async (password) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { password }, { withCredentials: true });
    return response.data;
  },

  isAdmin: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, { withCredentials: true });
      return response.status === 200;
    } catch {
      return false;
    }
  },

  getMe: async () => {
    const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
    return response.data;
  }
};

export default authService;
