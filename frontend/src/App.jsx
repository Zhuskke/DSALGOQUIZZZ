import { useState } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileScreen from "./screens/ProfileScreen";
import VerificationScreen from "./screens/VerificationScreen"
import RequestChangepass from "./screens/RequestChangepass";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} exact/>
              <Route path='login/' element={<LoginScreen />} />
              <Route path='request-changepass/' element={<RequestChangepass />} />
              <Route path='confirm-changepass/:uid/:token/' element={<ConfirmChangepass />} />
              <Route path='register/' element={<RegisterScreen />} />
              <Route path="verify-otp/:userId/" element={<VerificationScreen />} />
              <Route path='profile/' element={<ProfileScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
