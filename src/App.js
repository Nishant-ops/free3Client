import React from "react";
import Free3UI from "./components/Free3UI/Free3UI";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import CreateContract from "./components/CreateContract/CreateContract";
import SignUp from "./components/SignUp/SignUp";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Free3UI />} />
      <Route path="/contract" element={<Free3UI />} />
      <Route path="/create" element={<CreateContract />} />
      <Route path="/login" element={<Login />} />
      <Route path="signUp" element={<SignUp />} />
    </Routes>
  );
};

export default App;
