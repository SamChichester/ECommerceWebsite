import { useEffect } from "react";
import axios from "axios";

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(
          'http://localhost:8000/api/users/logout/',
          { refresh_token: localStorage.getItem('refresh_token') },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';  // Redirect to login page after logout
      } catch (error) {
        console.log('Logout failed:', error);
      }
    };

    logout();
  }, []);

  return null; // or a loading spinner/message while logging out
};

export default Logout;