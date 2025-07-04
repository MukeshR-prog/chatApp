import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import animationData from "./assets/lottie-json.json";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading,setloading] =useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO,{withCredentials:true});
        if(res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        }else{
          setUserInfo(undefined);
        }
        console.log(res);
      }
      catch (error) {
        console.error("Error fetching user data", error.message);
        setUserInfo(undefined);
      }
      finally{
        setloading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }else{
      setloading(false);
    }
  },[userInfo, setUserInfo])

if(loading){
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <div className="bg-[#1c1d25] " style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      // background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
      color: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      <Lottie options={defaultOptions} height={220} width={220} />
      <h2 style={{marginTop: 24, fontWeight: 700, fontSize: 28, letterSpacing: 1, color: '#fff', textShadow: '0 2px 8px #0ea5e9'}}>Welcome to ChatterBox!</h2>
      <p style={{marginTop: 10, fontSize: 18, color: '#e0e7ef', maxWidth: 400, textAlign: 'center', textShadow: '0 1px 4px #0ea5e9'}}>
        Connecting you to your friends and conversations.<br/>Hang tight while we get everything ready for you!
      </p>
    </div>
  )
}

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
