import React, { useState } from "react";
import "./Auth.css";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// import {useHistory} from 'react-router-dom'

const Auth = () => {
  const [signIn, setSignIn] = useState(true);
  const [loading, setLoading] = useState(false);

  const history = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup } = useAuth();
  const { login } = useAuth();

  const userSignIn = async () => {
    setLoading(true);
    try {
      await login(email, password)
        .then((result) => {
          history("/");
          // console.log(result)
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert("Error :", error);
    }
    setLoading(false);
  };

  const userSignUp = async () => {
    setLoading(true);
    try {
      await signup(email, password)
        .then((result) => {
          history("/");
          // console.log(result)
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert("Error :", error);
    }
    setLoading(false);
  };

  return (
    <div className="auth__container">
      <div className="auth__box__container">
        <span className="auth__box__header">
          {signIn ? "Sign in" : "Sign up"}
        </span>
        <div className="input__container">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="auth__input"
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="auth__input"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="pass__acc">
          <span onClick={() => setSignIn(!signIn)}>
            {signIn
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </span>
        </div>
        <button
          onClick={() => {
            if (signIn) {
              userSignIn();
            } else {
              userSignUp();
            }
          }}
          disabled={loading}
          className="auth__button"
        >
          {signIn ? "Sign in" : "Sign up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
