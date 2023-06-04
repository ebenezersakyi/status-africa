import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Auth from "./components/auth/Auth";
import BusinessPage from "./components/businessPage/BusinessPage";

import PrivateRoute from "./components/privateRoute/PrivateRoute";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            <Route element={<PrivateRoute />}>
              <Route path="/business" element={<BusinessPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
