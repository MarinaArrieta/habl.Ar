import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Techniques from "../pages/Techniques";
import NotFound from "../pages/NotFound";


export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/techniques" element={<Techniques />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
