import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { TimerProvider } from "./hooks/TimerContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Application from "./components/Application";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <TimerProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </TimerProvider>
      </UserProvider>
    </Provider>
  );
}

export default App;
