import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./components/LogIn";
import Application from "./components/Application";
import SignUp from "./components/SignUp";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/Application" element={<Application />} />
        <Route path="SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
