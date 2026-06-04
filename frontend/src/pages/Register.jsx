import React from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation/authSchema";
import api from "../services/api";

import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

const onSubmit = async (data) => {
  try {
    await api.post("/register", data);

    toast.success("Register successful!");

    navigate("/");

  } catch (err) {
    toast.error(err.response?.data?.message || "Error occurred");
  }
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SECTION (UNCHANGED COMPLETELY) */}
      <div className="w-full md:w-[40%] min-h-[350px] md:min-h-screen bg-[#003B5C] relative overflow-hidden flex items-center justify-center">

        {/* Decorative Shapes (UNCHANGED) */}
        <div className="absolute top-0 left-0 w-56 sm:w-72 h-56 sm:h-72 bg-white/10 rotate-45 -translate-x-24 -translate-y-24"></div>

        <div className="absolute top-12 left-12 sm:left-24 w-8 sm:w-10 h-8 sm:h-10 bg-white/20 rotate-45"></div>

        <div className="absolute top-1/3 right-0 w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-white/10"></div>

        <div className="absolute bottom-24 left-10 sm:left-24 w-10 sm:w-12 h-10 sm:h-12 bg-white/15 rotate-45"></div>

        <div className="absolute bottom-16 right-10 w-4 h-4 rounded-full bg-white/20"></div>

        <svg
          className="absolute bottom-10 left-10 sm:left-20 w-16 sm:w-20 h-16 sm:h-20 text-white/15"
          viewBox="0 0 100 100"
        >
          <polygon points="50,15 90,85 10,85" fill="currentColor" />
        </svg>

        {/* Content (UNCHANGED) */}
        <div className="relative z-10 text-center text-white px-6 sm:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Welcome Back!
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed mb-10">
            To keep connected with us please
            <br />
            login with your personal info
          </p>

          <button
            onClick={() => navigate("/")}
            className="border-2 border-white px-10 sm:px-14 py-3 rounded-full font-bold tracking-wider hover:bg-white hover:text-[#003B5C] transition-all duration-300"
          >
            SIGN IN
          </button>
        </div>
      </div>

      {/* RIGHT SECTION (ONLY LOGIC ADDED, NO UI CHANGE) */}
      <div className="w-full md:w-[60%] bg-white flex items-center justify-center px-6 sm:px-10 lg:px-20 py-12">

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md sm:max-w-lg">

          <h1 className="text-center text-[#E8A112] text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold mb-10">
            Create Account
          </h1>

          {/* NAME */}
          <div className="relative mb-5">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="w-full h-12 sm:h-14 bg-[#ECEFED] rounded-lg pl-12 pr-4 outline-none border border-transparent focus:border-[#E8A112] transition-all"
            />
          </div>
          <p className="text-red-500 text-sm mb-3 ml-1">
            {errors.name?.message}
          </p>

          {/* EMAIL */}
          <div className="relative mb-5">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="w-full h-12 sm:h-14 bg-[#ECEFED] rounded-lg pl-12 pr-4 outline-none border border-transparent focus:border-[#E8A112] transition-all"
            />
          </div>
          <p className="text-red-500 text-sm mb-3 ml-1">
            {errors.email?.message}
          </p>

          {/* PASSWORD */}
          <div className="relative mb-8">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full h-12 sm:h-14 bg-[#ECEFED] rounded-lg pl-12 pr-4 outline-none border border-transparent focus:border-[#E8A112] transition-all"
            />
          </div>
          <p className="text-red-500 text-sm mb-5 ml-1">
            {errors.password?.message}
          </p>

          {/* BUTTON (UNCHANGED) */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#E8A112] hover:bg-[#D8940D] text-white font-bold tracking-wider px-12 sm:px-16 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300"
            >
              SIGN UP
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Register;