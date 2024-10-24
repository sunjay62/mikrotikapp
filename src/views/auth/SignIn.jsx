import React, { useEffect, useState } from "react";
import Logo1 from "../../assets/img/logo/logo3.png";
import Checkbox from "components/checkbox";
import useAuthStore from "utils/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import LoadingScreen from "components/loadingscreen";
import { toast } from "react-toastify";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onLogin();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/admin/home");
    }
  }, [navigate]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/userlogin/login`, {
        username,
        password,
      });

      console.log(response);

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      setToken(response.data.access_token);
      toast.success("Login Successfully");
      setLoading(false);
      navigate("/admin/home");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid username or password!");
        setLoading(false);
      } else {
        console.error(error);
        setLoading(false);
        toast.error("Internal Server Error!");
      }
    }
  };

  return (
    <div
      className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start"
      onKeyDown={handleKeyPress}
    >
      {loading && <LoadingScreen />}
      {/* Sign in section */}

      <div className=" w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <div className="mb-11 flex h-[50px] w-full items-center justify-center gap-2 hover:cursor-pointer ">
          <img className="w-44" src={Logo1} alt="" />
        </div>
        <div className="flex-col items-center justify-center">
          <h4 className="mb-2.5 flex justify-center text-4xl font-bold text-navy-700 dark:text-white">
            Sign In
          </h4>
          <p className="mb-6 ml-1 flex justify-center text-base text-gray-600">
            Enter your username and password to sign in!
          </p>
        </div>

        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          {/* <p className="text-base text-gray-600 dark:text-white"> or </p> */}
          {/* <div className="h-px w-full bg-gray-200 dark:bg-navy-700" /> */}
        </div>
        {/* Email */}
        <label
          htmlFor="username"
          className={`ml-3 text-sm text-navy-700 dark:text-white`}
        >
          Username*
        </label>
        <input
          className="mb-5 mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none  dark:!border-white/10 dark:text-white"
          label="Email*"
          placeholder="Username"
          type="text"
          id="username"
          onChange={handleUsernameChange}
          value={username}
        />

        {/* Password */}
        <label
          htmlFor="password"
          className={`ml-3  text-sm text-navy-700 dark:text-white`}
        >
          Password*
        </label>
        <input
          className="mb-5 mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
          label="Password*"
          id="Password"
          placeholder="Min. 8 characters"
          type="password"
          onChange={handlePasswordChange}
          value={password}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
