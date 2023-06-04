import React, { useEffect, useState } from "react";
import "./Header.css";

import { useAuth } from "../../../contexts/AuthContext";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showAccountDia, setShowAccountDis] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        // console.log(user.email)
        setUserEmail(user.email);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const userLogout = async () => {
    try {
      await logout();
      setShowAccountDis(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navToBusPage = () => {
    navigate("/business", {
      state: {
        existing: false,
      },
    });
  };

  return (
    <div className="header__container">
      <div className="header__rightsection">
        {loggedIn ? (
          <span
            className="account__icon"
            onClick={() => setShowAccountDis(!showAccountDia)}
          >
            {userEmail[0].toUpperCase()}
          </span>
        ) : (
          <a className="heaeder__link" href="/auth">
            Login
          </a>
        )}
      </div>
      {showAccountDia && (
        <div className="dialogue">
          <div className="account__info">
            <span
              className="account__icon"
              onClick={() => setShowAccountDis(!showAccountDia)}
            >
              {userEmail[0].toUpperCase()}
            </span>
            <span className="home__email">{userEmail}</span>
          </div>
          <div className="account__actions" onClick={navToBusPage}>
            <i>
              <AddIcon />
            </i>
            <span>Link your business</span>
          </div>
          <div onClick={userLogout} className="account__actions">
            <i>
              <LogoutIcon />
            </i>
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
