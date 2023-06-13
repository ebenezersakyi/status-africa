import React, { useEffect, useState } from "react";
import "./Header.css";

import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

import { useAuth } from "../../../contexts/AuthContext";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../../firebase";
const firestore = getFirestore(app);
const auth = getAuth(app);

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showAccountDia, setShowAccountDis] = useState(false);
  const [hasLinkedBusiness, setHasLinkedBusiness] = useState(false);
  const [businessDataH, setBusinessDataH] = useState({});

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

  useEffect(() => {
    searchBusinesses();
  }, [loggedIn]);

  const searchBusinesses = async () => {
    try {
      const businessRef = collection(firestore, "bussinesses");
      const q = query(
        businessRef,
        where("email", "==", firebase.auth().currentUser.email)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setBusinessDataH(data);
        console.log("Found document:", data);
      });

      if (querySnapshot) {
        setHasLinkedBusiness(true);
      } else {
        setHasLinkedBusiness(false);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };

  const userLogout = async () => {
    try {
      await logout();
      setShowAccountDis(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const navToCreateBusPage = () => {
    navigate("/businessprofilesetup", {
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
          {!hasLinkedBusiness ? (
            <div className="account__actions" onClick={navToCreateBusPage}>
              <i>
                <AddIcon />
              </i>
              <span>Link your business</span>
            </div>
          ) : (
            <div
              className="account__actions"
              onClick={() => navigate("/businessprofile")}
            >
              <i>
                <SearchIcon />
              </i>
              <span>{businessDataH.name}</span>
            </div>
          )}
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
