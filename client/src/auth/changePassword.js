import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "../css/changePassword.css";
import "react-toastify/dist/ReactToastify.css";
import passwordImage from "../assets/security.png";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from "react-redux";

const ChangePassword = (props) => {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const user = useSelector(state => state.authReducer);

  const search = useLocation().search;
  const token = new URLSearchParams(search).get("user");

  const cookies = new Cookies();
  const history = new useHistory();

  function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  const submitButton = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Both password must be same");
    } else {
      const {user,token} = queryString.parse(props.location.search)
      await axios({
        method : "PATCH",
        url : 'https://ministore-backend.herokuapp.com/api/v1/auth/user/password',
        headers : {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        },
        data : {
          user,
          token,
          password
        }
      })
      .then((res) => res.data)
      .then(data => {
        history.push("/signin?reset=true");
      })
      .catch((err) => {
        toast.error(err.response.data.msg)
      });
    }
  };

  if (user.jwtToken !== '') {
    history.push("/");
  } else {
    return (
      <>
        <div className="change-password-maindiv">
          <ToastContainer />
          <h1 className="forgot-password-heading text-center mt-10">
            CHANGE PASSWORD
          </h1>
          <div className="change-password-innerdiv">
            <div className="change-password-design">
              <img
                src={passwordImage}
                width="250"
                className="change-password-image"
              />
            </div>
            <div className="change-password-form">
              <form onSubmit={submitButton}>
                <div className="form-group">
                  <label>New Password :</label>
                  <input
                    type="password"
                    value={password}
                    name="password"
                    id="password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter Password"
                    required
                  />
                  <div className="register-show-password">
                    <input type="checkbox" onClick={showPassword} />
                    <span> Show Password</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Re-enter Password :</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    name="cpassword"
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter Confirm Password"
                    required
                  />
                </div>
                <div className="button-div">
                  <input type="submit" className="btn btn-primary" />
                </div>
                <div className='text-center mt-2'>
                  <Link to="/signin" className="register-login">
                    Go To Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
  return 0;
};

export default ChangePassword;
