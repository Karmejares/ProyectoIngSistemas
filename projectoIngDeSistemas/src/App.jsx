import React from "react";
import { UserProvider } from "./components/UserContext";
import { Routes, Route } from "react-router-dom";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Application from "./components/Application";
import ProtectedRoute from "./components/ProtectedRoute";
import { TimerProvider } from "./components/TimerContext";
import { Provider } from "react-redux"; // ✅ Import the Redux Provider
import { store } from "./redux/store"; // ✅ Import your configured store

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* ✅ Wrap with Redux Provider */}
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
    </Provider>
  );
}

export default App;
