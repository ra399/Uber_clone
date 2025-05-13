import React ,{useEffect} from 'react'
import {Routes , Route , Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import HomePage from './pages/HomePage';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignup from './pages/CaptainSignup';
import Home from './pages/Home';
import CaptainHome from './pages/CaptainHome';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import {Loader} from 'lucide-react';
import { userAuthStore } from './store/userAuthStore';
import { CaptainAuthStore } from './store/captainAuthStore';

const App = () => {
  const {authUser,isCheckingAuth,checkAuth} = userAuthStore();
  const {authCaptain} = CaptainAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  // console.log(authUser);

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  // console.log(authUser);

  return (
    <div>
        <Routes>
          <Route path="/" element={authUser ? <Navigate to="/home" /> : authCaptain ?  <CaptainHome /> : <HomePage /> } />
          <Route path="/user-login" element={authUser ? <Navigate to="/home" /> : <UserLogin /> } />
          <Route path="/user-signup" element={authUser ? <Navigate to="/home" /> : <UserSignup /> } />
          <Route path="/captain-signup" element={authCaptain ? <Navigate to="/captain-home" /> : <CaptainSignup /> } />
          <Route path="/captain-login" element={authCaptain ? <Navigate to="/captain-home" />: <CaptainLogin /> } />
          <Route path="/home" element={authUser? <Home /> : <Navigate to="/user-login" /> } />
          <Route path='/captain-home' element={authCaptain ? <CaptainHome /> : <Navigate to="/captain-login" /> } />
          <Route path='/riding' element={<Riding />} />
          <Route path='/captain-riding' element={<CaptainRiding />} />
        </Routes>

        <Toaster />
    </div>

     
  )
}

export default App