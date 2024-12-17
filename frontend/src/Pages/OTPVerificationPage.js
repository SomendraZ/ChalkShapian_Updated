import axios from "axios";
import { useAuth } from "../AuthContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/OTPVerificationPage.css";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");
  const REACT_APP_USER_OTP_VERIFY_API =
    process.env.REACT_APP_USER_OTP_VERIFY_API;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("OTP must be 6 digits.", {
        position: "top-left",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${REACT_APP_USER_OTP_VERIFY_API}`, {
        email,
        otp: otpString,
      });

      if (response.status === 200) {
        localStorage.removeItem("email");

        const { chalkName, email, token, isAdmin, isVerified } = response.data;
        login(chalkName, email, token, isAdmin, isVerified);

        navigate("/discover");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.", {
        position: "top-left",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    let value = e.target.value;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && value !== "") {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpDelete = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index] === "" && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }

      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="otpVerificationContainer">
        <div className="enterOTP">Enter OTP</div>
        <div className="otpInstructions">
          We've sent an OTP to your email address. Please check your inbox and
          enter the OTP below.
        </div>
        <form onSubmit={handleSubmit} className="otpForm">
          <div className="otpInputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                className="otpInput"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpDelete(e, index)}
                placeholder="-"
                maxLength="1"
                required
              />
            ))}
          </div>
          <button type="submit" disabled={loading} className="verifyButton">
            Verify OTP
          </button>
        </form>
      </div>
    </>
  );
};

export default OTPVerificationPage;
