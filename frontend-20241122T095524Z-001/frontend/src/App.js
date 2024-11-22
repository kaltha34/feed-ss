import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useAuthContext } from "./hooks/useAuthContext";

// importing components
import LandingPage from "./pages/landingPage";
import Notfound from "./pages/notfound";
import Dashboard from "./pages/dashboard";
import Dashboard2 from "./pages/dashboard2";
import CompanyInfo from "./pages/companyInfo";


function App() {
  const { user }= useAuthContext()
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/company/:companyUsername" element={<CompanyInfo />} />

        <Route path="/dashboard" element={user ?<Dashboard /> : <Navigate to='/'/> } />
        <Route path="/dashboard2" element={user ?<Dashboard2 /> : <Navigate to='/'/> } />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
