import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login} from "./Pages/Login/Login.js";
import {Dashboard} from './Pages/Dashboard/Dashboard.js'
import { Home } from './Pages/Home/Home'
import {User} from './Pages/Dashboard/User.js'
// import OTPVerification from './Pages/Login/OTPVerification.js';
// import { ResetPassword } from './Pages/Login/ResetPassword.js';
import { routes } from './Routes/routes'
import { CreateUser } from "./Pages/Dashboard/CreateUser";
export const App = () => {
  return (
    <div> 
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/User" element={<User />} />
         <Route path="/create-user" element={<CreateUser />} />
          {/* <Route path="/OTPVerification" element={<OTPVerification/>} /> */}
          {/* <Route path="/ResetPassword" element={<ResetPassword/>} /> */}
          <Route path="/Dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}
