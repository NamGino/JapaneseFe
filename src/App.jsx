import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home.jsx";
import Daily from "./pages/daily/daily.jsx";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import User from "./pages/user/user.jsx";
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/daily" element={<Daily />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;