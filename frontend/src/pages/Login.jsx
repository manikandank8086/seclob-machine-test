import React from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/authSchema";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
const onSubmit = async (data) => {
  try {
    console.log("button clicked");

    const res = await api.post("/login", data);

    const token = res.data.token;

    localStorage.setItem("token", token);
console.log("before dispatch");
    dispatch(
      loginSuccess({
        user: res.data.user,
        token: token,
      })
    );
console.log(2)
    toast.success("Login successful");

    navigate("/home", { replace: true });

  } catch (err) {
    toast.error(err.response?.data?.message);
  }
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SECTION - 60% */}
      <div className="w-full md:w-[60%] bg-white flex items-center justify-center px-6 sm:px-10 lg:px-20 py-12">

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">

          <h1 className="text-center text-[#E8A112] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-10">
            Sign In to
            <br />
            Your Account
          </h1>

          {/* Email */}
          <div className="relative mb-2">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full h-12 sm:h-14 bg-[#ECEFED] rounded-lg pl-12 pr-4 outline-none border border-transparent focus:border-[#E8A112] transition"
            />
          </div>

          {/* ERROR EMAIL */}
          <p className="text-red-500 text-sm mb-3 ml-1">
            {errors.email?.message}
          </p>

          {/* Password */}
          <div className="relative mb-2">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full h-12 sm:h-14 bg-[#ECEFED] rounded-lg pl-12 pr-4 outline-none border border-transparent focus:border-[#E8A112] transition"
            />
          </div>

          {/* ERROR PASSWORD */}
          <p className="text-red-500 text-sm mb-3 ml-1">
            {errors.password?.message}
          </p>

          {/* Forgot Password */}
          <div className="text-center mb-8">
            <button className="text-sm font-medium text-gray-700 hover:text-[#E8A112] underline transition">
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#E8A112] hover:bg-[#D8940D] text-white font-bold tracking-wider px-12 sm:px-16 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300"
            >
              SIGN IN
            </button>
          </div>

        </form>

      </div>

      {/* RIGHT SECTION - 40% (UNCHANGED) */}
      <div className="w-full md:w-[40%] min-h-[350px] md:min-h-screen bg-[#003B5C] relative overflow-hidden flex items-center justify-center">

        <div className="absolute top-0 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-white/10 rotate-45 translate-x-24 -translate-y-24" />
        <div className="absolute top-12 right-12 sm:right-28 w-8 sm:w-10 h-8 sm:h-10 bg-white/20 rotate-45" />
        <div className="absolute top-1/3 left-0 w-14 sm:w-20 h-14 sm:h-20 rounded-full bg-white/10" />
        <div className="absolute bottom-28 right-10 sm:right-24 w-10 sm:w-12 h-10 sm:h-12 bg-white/15 rotate-45" />
        <div className="absolute bottom-16 left-10 w-4 h-4 rounded-full bg-white/20" />

        <svg
          className="absolute bottom-10 right-10 sm:right-20 w-16 sm:w-20 h-16 sm:h-20 text-white/15"
          viewBox="0 0 100 100"
        >
          <polygon points="50,15 90,85 10,85" fill="currentColor" />
        </svg>

        <div className="relative z-10 text-center text-white px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Hello Friend!
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed mb-10">
            Enter your personal details and
            <br />
            start your journey with us
          </p>

          <button
            onClick={() => navigate("/register")}
            className="border-2 border-white px-10 sm:px-14 py-3 rounded-full font-bold tracking-wider hover:bg-white hover:text-[#003B5C] transition-all duration-300"
          >
            SIGN UP
          </button>
        </div>

      </div>

    </div>
  );
};

export default Login;