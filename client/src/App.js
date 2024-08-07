import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegistrationForm from "./Components/RegistrationForm";
import Navbar from "./Components/Navbar/Navbar";
import LoginForm from "./Components/Login/LoginForm";
import Home from "./Components/Home/Home";
import PHQQuestionnaire from "./Components/Questionnaire/PHQQuestionnaire";
import HADSQuestionnaire from "./Components/Questionnaire/HADSQuestionnaire";
import BDIQuestionnaire from "./Components/Questionnaire/BDIQuestionnaire";
import Profile from "./Components/Profile/Profile";
function App() {
  return (
    <>
      <ToastContainer theme="colored" autoClose={3000} />
        <Router>
          <main>
            <Navbar/>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route  path="/register" element={<RegistrationForm/>} />
              <Route  path="/login" element={<LoginForm/>} />
              <Route path='/phq9questionnaire' element={<PHQQuestionnaire/>}/>
              <Route path='/hadsquestionnaire' element={<HADSQuestionnaire/>}/>
              <Route path='/bdiquestionnaire' element={<BDIQuestionnaire/>}/>
              <Route path='/profile' element={<Profile/>}/>
            </Routes>
          </main>
        </Router>

    </>
  );
}

export default App;
