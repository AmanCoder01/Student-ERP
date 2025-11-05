import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";

import loginImgUrl from "../../assets/login.jpg"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      dispatch(login(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate(`/${res.data.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const AnimatedBackground = () => (
    <>
      <style>
        {`
          @keyframes animate-shapes {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
              100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
          }
          .background-shapes li {
              position: absolute;
              display: block;
              list-style: none;
              width: 20px;
              height: 20px;
              background: rgba(255, 255, 255, 0.10);
              animation: animate-shapes 25s linear infinite;
              bottom: -150px;
          }
          .background-shapes li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
          .background-shapes li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
          .background-shapes li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
          .background-shapes li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
          .background-shapes li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
          .background-shapes li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
          .background-shapes li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
          .background-shapes li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
          .background-shapes li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
          .background-shapes li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }
        `}
      </style>
      <ul className="background-shapes">
        <li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
    </>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 p-4">
      {/* Blackish gradient background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <AnimatedBackground />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Left Side: Image */}
        <motion.div
          className="w-1/2 hidden md:block"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            className="w-full h-full object-cover brightness-75"
            src={loginImgUrl}
            alt="Students collaborating"
          />
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          className="w-full md:w-1/2 p-8 bg-gray-800/40 backdrop-blur-lg border-l border-gray-700"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center text-white">
              Welcome Back
            </h1>

            <div className="relative">
              <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-transparent bg-white/10 py-2 pl-12 pr-4 text-white placeholder-gray-400 transition-all focus:border-rose-400 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-transparent bg-white/10 py-2 pl-12 pr-4 text-white placeholder-gray-400 transition-all focus:border-rose-400 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-rose-500 py-2 text-lg font-semibold text-white transition-all duration-300 hover:scale-103 hover:bg-rose-600 focus:outline-none cursor-pointer "
            >
              Login
            </button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-300 hover:text-white hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
