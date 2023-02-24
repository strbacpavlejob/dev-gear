import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import reg from "../images/reg.jpg";

const RegisterForm = (props) => {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logged, setLogged] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8000/user",
        {
          username: userName,
          email,
          password,
          confirmPassword,
        },
        { withCredentials: true }
      )
      .then((res) => {
        sessionStorage.setItem("userInSession", res.data.username);
        setLogged(res.data.user);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        const errorRes = err.response.data.errors;
        const errorArr = [];

        for (const key of Object.keys(errorRes)) {
          errorArr.push(errorRes[key].message);
        }
        setErrors(errorArr);
      });
  };

  return (
    <div className="bg-gradient-to-br from-white via-white to-light-blue">
      <main className="relative h-screen">
        <div className="h-80 overflow-hidden hidden lg:block lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <img
            src={reg}
            alt="colorful floating"
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2 mt-20 xl:mt-32">
            <a href="/">
              <h1 className="text-center text-5xl font-fugaz text-dark-blue py-6 border-b">
                DEV GEAR
              </h1>
            </a>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-dark-blue">
              Register
            </h2>
            <form className="space-y-6 mt-6" onSubmit={onSubmitHandler}>
              {errors.map((error, idx) => (
                <p style={{ color: "red" }} key={error + idx}>
                  {error}
                </p>
              ))}
              <div className="mb-3 row">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue focus:outline-none focus:ring-blue sm:text-sm"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue focus:outline-none focus:ring-blue sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div>
                  <input
                    type="password"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue focus:outline-none focus:ring-blue sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div>
                  <input
                    type="password"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue focus:outline-none focus:ring-blue sm:text-sm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-dark-blue py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-light-blue focus:outline-none focus:ring-2 focus:ring-bluefocus:ring-offset-2"
              >
                Create Account
              </button>
            </form>
            <a href="/user/login">
              <h3 className="mt-6 text-sm font-medium text-dark-blue hover:text-blue">
                Already have an account? Login here &rarr;
              </h3>
            </a>
            <a href="/">
              <h3 className="mt-6 text-sm font-medium text-dark-blue hover:text-blue">
                Return to Home
              </h3>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterForm;
