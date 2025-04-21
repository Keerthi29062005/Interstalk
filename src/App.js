import React from 'react';
import './App.css';
import Home from './screen/Home';
import Login from './screen/Login';
import Signup from './screen/Signup';
import UserPage from './screen/UserPage.js';
import Interests from './screen/Interests.js';
import EnterOTP from './screen/EnterOTP.js';
import ResetPassword from './screen/ResetPassword.js';
import TemporaryDrawer from './screen/Chat.js';
import Profile from './screen/Profile.jsx';
import Community from './screen/Community.js';
import EnhancedNavBar from './screen/Chat.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function App() {
  return (
    <Router>
       <div>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/Login" element={<Login/>} />
          <Route exact path="/Signup" element={<Signup/>} />
          <Route exact path="/:id/interests" element={<Interests/>} />
          <Route exact path="/:id" element={<UserPage/>} />
          <Route exact path="/EnterOTP" element={<EnterOTP/>} />
          <Route exact path="/ResetPassword" element={<ResetPassword/>} />
          <Route exact path="/chat" element={<EnhancedNavBar/>} />
          <Route exact path="/:id/community" element={<Community/>} />
        </Routes>
       </div>
    </Router>
  );
}

export default App;
