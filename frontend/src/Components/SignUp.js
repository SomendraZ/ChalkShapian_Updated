import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../CSS/SignUp.css";
import Gif from "../Resources/Chalk_Shapian.gif";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const validateEmail = (email) => {
    // regex to check email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const signup = async (e) => {
    e.preventDefault();

    const chalkName = values.username;
    const name = values.name;
    const email = values.email;
    const password = values.password;
    const confirmPassword = document.getElementById(
      "confirmPasswordSignUp"
    ).value;

    // Check if any of the input fields are empty
    if (!chalkName || !name || !email || !password || !confirmPassword) {
      toast.error("Please fill out all the fields before submitting.", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match", {
        position: "top-left",
        autoClose: 1000,
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
          autoClose: 1000,
        }
      );
      return;
    }

    if (!validateEmail(email)) {
      toast.warning("Please enter a valid email address.", {
        position: "top-left",
        autoClose: 1000,
      });
      return;
    }

    sessionStorage.setItem("LoggedIn", true);

    sessionStorage.setItem("chalkName", chalkName);
    navigate("/discover");
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
                    setValues((prev) => ({ ...prev, name: event.target.value }))
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
              <div className="already">Already have a account ?</div>
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
