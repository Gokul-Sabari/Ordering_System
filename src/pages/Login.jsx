import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import CircularProgress from "@mui/material/CircularProgress";
import { encryptPasswordFun } from "../components/functions";
import { useNavigate } from "react-router-dom"; 
import { fetchLink } from "../components/fetchComponent";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setLoginTrue }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true);

  // Check localStorage on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const user = localStorage.getItem("user");
        const session = localStorage.getItem("session");
        const loginAt = localStorage.getItem("loginAt");

        // If any required auth data is missing, ensure we're on login page
        if (!user || !session || !loginAt) {
          // Clear any partial data
          localStorage.removeItem("user");
          localStorage.removeItem("session");
          localStorage.removeItem("loginAt");
          
          // If we're not already on the login page, redirect to root
          if (window.location.pathname !== '/') {
            navigate('/', { replace: true });
          }
        } else {
          // If auth data exists, user is already logged in, redirect to POS
          if (setLoginTrue) {
            setLoginTrue();
          }
          navigate('/pos', { replace: true });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // If there's an error, redirect to root
        navigate('/', { replace: true });
      } finally {
        setCheckingStorage(false);
      }
    };

    checkAuthStatus();
  }, [navigate, setLoginTrue]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const APP_Type = 2;
    
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const passHash = encryptPasswordFun(password);
      const data = await fetchLink({
        address: `authorization/login`,
        method: 'POST',
        bodyData: { username: username, password: passHash, APP_Type }
      });

      if (data.success) {
        const { user, sessionInfo } = data;

        // Store auth data in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("session", JSON.stringify(sessionInfo));
        localStorage.setItem('loginAt', new Date().toString());

        if (setLoginTrue) {
          setLoginTrue();
        }
        
        toast.success("Login successful!");
        navigate('/pos', { replace: true }); 
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking storage
  if (checkingStorage) {
    return (
      <div className="main">
        <div className="cntr">
          <div className="loading-container">
            <CircularProgress className="spinner" size={40} />
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="cntr">
        <div>
          <h2>👋 Welcome Back</h2>
          <p>Sign in to your account to continue</p>
          <div className="logform">
            <div className="logo-section">
              <span className="hedundr">Sign</span> In
            </div>
            
            <form onSubmit={handleLogin}>
              <div>Username</div>
              <input 
                type="text" 
                className="loginpt" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username"
                required 
                autoFocus
              />
              
              <div>Password</div>
              <input 
                type="password" 
                className="loginpt" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required 
              />
              
              <button 
                className="logsbmt" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="overlay">
                    <CircularProgress className="spinner" size={24} />
                  </div>
                )}
                Sign In
              </button>
            </form>
            
            <div className="footer-note">
              <p>Enter your credentials to access the system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;