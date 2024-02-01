import React from "react";
import Free3UI from "./components/Free3UI/Free3UI";
import { Routes, Route } from "react-router-dom";
import CreateContract from "./components/CreateContract/CreateContract";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Free3UI />} />
      <Route path="/contract" element={<Free3UI />} />
      <Route path="/create" element={<CreateContract />} />
    </Routes>
  );
};

export default App;
