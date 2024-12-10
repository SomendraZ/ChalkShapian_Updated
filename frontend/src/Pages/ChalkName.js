import React, { useState } from "react";
import "../CSS/ChalkName.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import arrow from "../Resources/rightArrow.png";

const ChalkName = () => {
  const navigate = useNavigate();
  const [chalkName, setChalkName] = useState("");

  const doneSignIn = async () => {
    if (chalkName === "") {
      alert("Please enter a Chalk Name.");
      return;
    } else if (!/^[a-zA-Z0-9 ]*$/.test(chalkName)) {
      toast.warning(
        "Chalk Name can only contain alphabets, numbers, and spaces.",
        {
          position: "top-right",
          delay: 1000,
        }
      );
      return;
    }
    localStorage.setItem("chalkName", chalkName);
    localStorage.setItem("LoggedIn", true);
    navigate("/discover");
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setChalkName(newValue);
  };

  return (
    <>
      <ToastContainer />
      <div className="bgColor">
        <h1>Enter Chalk Name : </h1>
        <input
          id="chalkName"
          placeholder="User Name"
          type="text"
          value={chalkName}
          onChange={handleChange}
        />
        <div className="arrow" onClick={doneSignIn}>
          <img src={arrow} alt="Right Arrow" id="arrow" />
        </div>
      </div>
    </>
  );
};

export default ChalkName;
