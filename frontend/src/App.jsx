import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Signup from "./pages/signup";
import ChatPage from "./pages/ChatPage";
import Signin from "./pages/signin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/chatPage" element={<ChatPage />} />
      <Route path="/search/:username" />
      <Route path="/sendmessage/:from/:to" />
      <Route path="/latest/:username" />
    </Routes>
  );
}

export default App;
