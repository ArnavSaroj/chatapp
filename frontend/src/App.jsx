import React, {  useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from './pages/homepage.jsx';
import Signup from './pages/signup.jsx';
import Settings from './pages/settings.jsx';
import Login from './pages/login.jsx';
import Profilepage from "./pages/profilepage.jsx";
import Navbar from './components/navbar.jsx';  
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from 'lucide-react'


const App = () => {
  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loader only while checking auth
  if (ischeckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to="/login" />} />
        {/* Allow access to signup and login routes even when not authenticated */}
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/profilepage" element={authUser ? <Profilepage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;