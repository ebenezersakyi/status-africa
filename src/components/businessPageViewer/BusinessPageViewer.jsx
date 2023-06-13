import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// import Rating from "react-rating";
import Footer from "../common/footer/Footer";
import "./BusinessPageViewer.css";
import { Rating } from "@mui/material";
import { Call } from "@mui/icons-material";
// import { Satellite } from "@mui/icons-material";
import { Web } from "@mui/icons-material";

import firebase from "firebase/compat/app";
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
import app from "../../firebase";
const firestore = getFirestore(app);
const auth = getAuth(app);

const containerStyle = {
  width: "90vw",
  height: "400px",
};

const BusinessPageViewer = () => {
  const Location = useLocation();
  const [businessData, setBusinessData] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {
    console.log("props", Location.state);
    searchBusinesses();
  }, [Location.state]);

  const searchBusinesses = async () => {
    try {
      const businessRef = collection(firestore, "bussinesses");
      const q = query(businessRef, where("_id", "==", Location.state._id));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setBusinessData(data);
        console.log("Found document:", data);
      });
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };

  if (businessData) {
    return (
      <div className="main__buss__contb">
        <div className="gpt__icon">
          <span>SOS</span>
        </div>
        <div className="first__section">
          <img
            src={businessData.businessImage}
            alt=""
            className="business__img"
          />
          <span className="buss__name">{businessData.name}</span>
          <span className="buss__loc">{businessData.cityAndCountry}</span>
          <span className="buss__desc">{businessData.description}</span>
          <div className="quick__actions">
            <div
              onClick={() => {
                window.location.href = `tel:${businessData.internationalPhone}`;
              }}
            >
              <Call
                style={{
                  backgroundColor: "whitesmoke",
                  borderRadius: 360,
                  padding: 5,
                  margin: 5,
                  cursor: "pointer",
                }}
              />
            </div>
            {businessData.websiteUrl.length > 0 && (
              <div
                onClick={() => {
                  window.open(businessData.websiteUrl, "_blank");
                }}
              >
                <Web
                  style={{
                    backgroundColor: "whitesmoke",
                    borderRadius: 360,
                    padding: 5,
                    margin: 5,
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* <div className="queue__info__section">
          <button
            onClick={() => setShowQueueDualogue(true)}
            className="update__queueinfo__btn"
          >
            Update queue information
          </button>
        </div> */}

        <div className="emplpoyee__section__container">
          <span className="empl__header">Employees</span>
          {/* <button
            className="addemployee__btn"
            onClick={() => setShowAddEmployeeDualogue(true)}
          >
            Add employee
          </button> */}

          <div className="employee__list__wrapper">
            {businessData?.employees.map((item, index) => (
              <EmployeeComponenet item={item} key={index} />
            ))}
          </div>
        </div>

        <div className="queue__section__container">
          <span className="empl__header">Queue Information</span>
          <span className="lst__udt">Last updated: </span>
          <div className="queue__information">
            <span>
              Queue Length: {businessData.queueInformation?.queueLength}
            </span>
            <span>
              Estimated Wait Time (in minutes):{" "}
              {businessData.queueInformation?.waitTime}
            </span>
            <span>
              Service Capacity: {businessData.queueInformation?.serviceCapacity}
            </span>
          </div>
        </div>

        <div className="map__section">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: businessData.coordinates.lat,
                lng: businessData.coordinates.lng,
              }}
              zoom={15}
              // onLoad={onLoad}
              // onUnmount={onUnmount}
              // onClick={(item) =>
              //   console.log(item.latLng.lat(), item.latLng.lng())
              // }
            >
              {/* Child components, such as markers, info windows, etc. */}
              <Marker
                // onDrag={(data) =>
                //   setMarkerCoordinates({
                //     lat: data.latLng.lat(),
                //     lng: data.latLng.lng(),
                //   })
                // }
                draggable={false}
                position={{
                  lat: businessData.coordinates.lat,
                  lng: businessData.coordinates.lng,
                }}
              />
            </GoogleMap>
          ) : (
            <></>
          )}
        </div>

        {/* <Footer /> */}
      </div>
    );
  }

  return <span>Loading</span>;

  function EmployeeComponenet({ item, key }) {
    const [hasRated, setHasRated] = useState(false);
    const [hasLoggedIn, setHasLoggedIn] = useState(false);

    useEffect(() => {
      const hasRated = item.rating?.some((ratingItem) => {
        return ratingItem.email === firebase.auth().currentUser.email;
      });

      setHasRated(hasRated);

      if (firebase.auth().currentUser.email) {
        setHasLoggedIn(true);
      }
    }, [item]);

    const addRatingToEmployee = async (employeeId, email, rating) => {
      try {
        const docRef = doc(firestore, "bussinesses", auth.currentUser.uid);
        const documentSnapshot = await getDoc(docRef);

        if (documentSnapshot.exists()) {
          const businessData = documentSnapshot.data();
          const employees = businessData.employees;

          const updatedEmployees = employees.map((employee) => {
            if (employee.id === employeeId) {
              const updatedRatings = [...employee.rating, { email, rating }];
              return { ...employee, rating: updatedRatings };
            }
            return employee;
          });

          await updateDoc(docRef, { employees: updatedEmployees });
          searchBusinesses();
          console.log("Rating added to employee successfully!");
        }
      } catch (error) {
        console.error("Error adding rating to employee:", error);
      }
    };

    const updateRatingByEmail = async (employeeId, email, rating) => {
      try {
        const docRef = doc(firestore, "bussinesses", auth.currentUser.uid);
        const documentSnapshot = await getDoc(docRef);

        if (documentSnapshot.exists()) {
          const businessData = documentSnapshot.data();
          const employees = businessData.employees;

          const updatedEmployees = employees.map((employee) => {
            if (employee.id === employeeId) {
              const updatedRatings = employee.rating.map((item) => {
                if (item.email === email) {
                  return { ...item, rating };
                }
                return item;
              });
              return { ...employee, rating: updatedRatings };
            }
            return employee;
          });

          await updateDoc(docRef, { employees: updatedEmployees });
          searchBusinesses();
          console.log("Rating updated successfully!");
        }
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    };

    const calculateMeanRating = (ratings) => {
      if (ratings.length === 0) {
        return 0; // Return 0 if there are no ratings
      }

      const sum = ratings.reduce(
        (accumulator, rating) => accumulator + rating.rating,
        0
      );
      const mean = sum / ratings.length;

      return mean;
    };

    const meanRating = calculateMeanRating(item.rating);
    return (
      <div key={item.id} className="employeecomp__container">
        <img src={item.employeeImage} alt="" className="employee__img" />
        <span className="employee__name">{item.employeeName}</span>
        <span className="employee__role">{item.employeeJobDescription}</span>
        <Rating
          name="simple-controlled"
          value={meanRating}
          onChange={(event, newValue) => {
            // setValue(newValue);
            // console.log(newValue);
            if (!hasLoggedIn) {
              alert("Please log in to access this feature");
            } else {
              if (!hasRated) {
                addRatingToEmployee(
                  item.id,
                  firebase.auth().currentUser.email,
                  newValue
                );
              } else {
                updateRatingByEmail(
                  item.id,
                  firebase.auth().currentUser.email,
                  newValue
                );
              }
            }
          }}
        />
        {hasRated ? (
          <span className="employee__role">Rated!</span>
        ) : (
          <span className="employee__role">Rate me!</span>
        )}
      </div>
    );
  }
};

export default BusinessPageViewer;
