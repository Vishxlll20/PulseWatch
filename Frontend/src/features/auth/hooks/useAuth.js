import { useSelector, useDispatch } from "react-redux";
import {
  login,
  register,
  logout,
  reset,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logoutAsync,
  setUser,
} from "../state/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  const loginUser = (email, password) => {
    return dispatch(login({ email, password }));
  };

  const registerUser = (username, email, password) => {
    return dispatch(register({ username, email, password }));
  };

  const forgotPasswordUser = (email) => {
    return dispatch(forgotPassword(email));
  };

  const verifyOtpUser = (otp) => {
    return dispatch(verifyOtp(otp));
  };

  const resetPasswordUser = (password) => {
    return dispatch(resetPassword(password));
  };

  const logoutUser = () => {
    return dispatch(logoutAsync());
  };

  const resetAuth = () => {
    dispatch(reset());
  };

  return {
    user,
    isLoading,
    isError,
    isSuccess,
    message,
    loginUser,
    registerUser,
    forgotPasswordUser,
    verifyOtpUser,
    resetPasswordUser,
    logoutUser,
    resetAuth,
    // Alias for compatibility with existing components
    loading: isLoading,
    error: isError ? message : null,
    login: async (email, password) => {
      const result = await dispatch(login({ email, password }));
      if (result.meta.requestStatus === "fulfilled") {
        return result.payload.user || result.payload;
      }
      return null;
    },
    register: async (username, email, password) => {
      const result = await dispatch(register({ username, email, password }));
      if (result.meta.requestStatus === "fulfilled") {
        return result.payload.user || result.payload;
      }
      return null;
    },
    forgotPassword: async (email) => {
      const result = await dispatch(forgotPassword(email));
      return result.meta.requestStatus === "fulfilled";
    },
    verifyOtp: async (otp) => {
      const result = await dispatch(verifyOtp(otp));
      return result.meta.requestStatus === "fulfilled";
    },
    resetPassword: async (password) => {
      const result = await dispatch(resetPassword(password));
      return result.meta.requestStatus === "fulfilled";
    },
  };
};
