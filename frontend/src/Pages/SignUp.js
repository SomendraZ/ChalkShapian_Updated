import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../CSS/SignUp.css";
import Gif from "../Resources/Chalk_Shapian.gif";
import { useAuth } from "../AuthContext";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    // Regex to check email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const signup = async (e) => {
    e.preventDefault();

    const { username, fullName, email, password } = values;
    const confirmPassword = document.getElementById(
      "confirmPasswordSignUp"
    ).value;

    // Check if any of the input fields are empty
    if (!username || !fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill out all the fields before submitting.", {
        position: "top-left",
        autoClose: 2000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match", {
        position: "top-left",
        autoClose: 2000,
      });
      return;
    }

    // Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      toast.warning(
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character",
        {
          position: "top-left",
          autoClose: 2000,
        }
      );
      return;
    }

    if (!validateEmail(email)) {
      toast.warning("Please enter a valid email address.", {
        position: "top-left",
        autoClose: 2000,
      });
      return;
    }

    // Sending the signup request to the backend API
    try {
      const response = await fetch(process.env.REACT_APP_USER_REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chalkName: username,
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful signup
        toast.success("Signup successful!", {
          position: "top-left",
          autoClose: 2000,
        });

        // Update auth context with user info and jwt token
        login(username, email, data.token);
        navigate("/discover");
      } else {
        // Handle errors
        toast.error(data.message || "Signup failed.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-left",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg">
        <div className="gif">
          <div id="gif">
            <img src={Gif} alt="" id="Gif" />
          </div>
          <div className="SignUpPage">
            <div className="SignUpToAccount">Create Account</div>
            <form>
              <div>
                <div className="flexRow">
                  <div className="chalkNameSignUp">CHALK NAME</div>
                  <div className="red">*</div>
                </div>
                <input
                  id="chalkNameSignUp"
                  placeholder="User Name"
                  type="text"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      username: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="flexRow">
                  <div className="nameSignUp">NAME</div>
                  <div className="red">*</div>
                </div>
                <input
                  id="nameSignUp"
                  placeholder="Name"
                  type="text"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="flexRow">
                  <div className="emailSignUp">EMAIL</div>
                  <div className="red">*</div>
                </div>
                <input
                  id="emailSignUp"
                  placeholder="Email"
                  type="email"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="flexRow">
                  <div className="passwordSignUp">PASSWORD</div>
                  <div className="red">*</div>
                </div>
                <input
                  id="passwordSignUp"
                  placeholder="Password"
                  type="password"
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="flexRow">
                  <div className="confirmPasswordSignUp">CONFIRM PASSWORD</div>
                  <div className="red">*</div>
                </div>
                <input
                  id="confirmPasswordSignUp"
                  placeholder="Confirm Password"
                  type="password"
                />
              </div>
              <button className="SignUpBtn" onClick={signup} type="submit">
                SignUp
              </button>
            </form>
            <div className="or">
              <div className="hLine" />
              OR
              <div className="hLine" />
            </div>
            <div className="alreadyAccount">
              <div className="already">Already have an account?</div>
              <Link className="login" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
