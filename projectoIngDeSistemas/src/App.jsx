import React from "react";
import { UserProvider } from "./components/UserContext";
import { Routes, Route } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Application from "./components/Application";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { TimerProvider } from "./components/TimerContext";

function App() {
  return (
    <UserProvider>
      <TimerProvider>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route
            path="/Application"
            element={
              <ProtectedRoute>
                <Application />
              </ProtectedRoute>
            }
          />
        </Routes>
      </TimerProvider>
    </UserProvider>
  );
}

export default App;
