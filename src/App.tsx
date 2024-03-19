import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import Chat from "./Pages/Chat";
import LoginPage from "./Pages/LoginPage";

import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat />
              </RequireAuth>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
