import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../CSS/Login.css";
import Gif from "../Resources/Chalk_Shapian.gif";
import { useAuth } from "../AuthContext";

const google = require("../Resources/google.png");

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const loginFunc = async (event) => {
    event.preventDefault();
    const email = values.email;
    const password = values.password;

    // Validate input
    if (!email || !password) {
      toast.error("Please fill out all the fields before submitting.", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    try {
      // Make API call to login
      const response = await fetch(`${process.env.REACT_APP_USER_LOGIN_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error message from the server
        toast.error(data.message, {
          position: "top-left",
          autoClose: 1000,
        });
        if (data.message !== "Invalid credentials.") {
          localStorage.setItem("email", email);
          navigate("/otpVerification");
        }
      } else {
        if (data.isVerified) {
          login(
            data.chalkName,
            data.email,
            data.token,
            data.isAdmin,
            data.isVerified
          );
          navigate("/discover");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-left",
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg">
        <div className="gif">
          <div id="gif">
            <img src={Gif} alt="Chalk Shapian Gif" id="Gif" />
          </div>
          <div className="loginPage">
            <div className="loginToAccount">Login To Your Account</div>
            <div>
              <div className="emailLogin">EMAIL</div>
              <input
                id="emailLogin"
                placeholder="Email"
                type="email"
                aria-label="Email"
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <div>
              <div className="passwordLogin">PASSWORD</div>
              <input
                id="passwordLogin"
                placeholder="Password"
                type={showPassword ? "text" : "password"} // Bind the type to showPassword state
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    loginFunc(event);
                  }
                }}
              />
              <span className="showPassword" onClick={togglePasswordVisibility}>
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
            <div className="remember">
              <input type="checkbox" id="check" />
              &nbsp;Remember me
            </div>
            <div className="loginBtn" onClick={loginFunc}>
              Login
            </div>
            <div className="or">
              <div className="hLine" />
              OR
              <div className="hLine" />
            </div>
            <div className="google">
              <img src={google} alt="" id="google" />
              Sign-in with Google
            </div>
            <div className="noAccount">
              <div className="dont">Don’t have an account?</div>
              <Link className="signUp" to="/signup">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
