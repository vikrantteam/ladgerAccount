import React, { useEffect, useState } from "react";
import "./loginPage.css";
import login from "../src/assets/login.gif";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem('user')!='login'){
      navigate('/login')
    }
  })
  const [loginDetail, setLoginDetail] = useState({
    username: "",
    password: "",
  });
  const [checkValid, setCheckValid] = useState(false);
  const loginFormEventHandler = async () => {
    const fd = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: loginDetail.username,
        password: loginDetail.password,
      }),
    });
    const data = await fd.json();
    if (data.status === 202) {
      localStorage.setItem("user","login")
      alert(data.message);
      // setCheckValid(true);
    } else {
      alert(data.error);
    }
    if(localStorage.getItem("user")===data.code){
      navigate("/customer");
    }else{
      navigate("/login");

    }
  };
  return (
    <>
      <div className="login-main-div">
        <div className="login-div">
          <div className="login-left-div">
            <img src={login} alt="" />
          </div>
          <div className="login-right-div">
            {/* <div className="title">
    <h1>Login Form</h1>
</div> */}
            <div className="input-div">
              <label htmlFor="">Username:</label>
              <input
                type="text"
                value={loginDetail.username}
                onChange={(e) => {
                  setLoginDetail({ ...loginDetail, username: e.target.value });
                }}
              />
            </div>
            <div className="input-div">
              <label htmlFor="">Password:</label>
              <input
                type="password"
                value={loginDetail.password}
                onChange={(e) => {
                  setLoginDetail({ ...loginDetail, password: e.target.value });
                }}
              />
            </div>
            <button
              onClick={() => {
                loginFormEventHandler();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
