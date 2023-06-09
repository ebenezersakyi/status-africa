import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebase";
import Footer from "../common/footer/Footer";
const firestore = getFirestore(app);
const auth = getAuth(app);

const Rating = require("react-rating");

const BusinessPageViewer = () => {
  const Location = useLocation();
  const [businessData, setBusinessData] = useState(null);

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

  return (
    <div className="main__buss__contb">
      <div className="first__section">
        <img
          src={businessData.businessImage}
          alt=""
          className="business__img"
        />
        <span className="buss__name">{businessData.name}</span>
        <span className="buss__loc">{businessData.cityAndCountry}</span>
        <span className="buss__desc">{businessData.description}</span>
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
        <span>Employees</span>
        {/* <button
          className="addemployee__btn"
          onClick={() => setShowAddEmployeeDualogue(true)}
        >
          Add employee
        </button> */}
        {businessData?.employees.map((item, index) => (
          <EmployeeComponenet item={item} key={index} />
        ))}
      </div>
      <Footer />
    </div>
  );

  function EmployeeComponenet({ item, key }) {
    return (
      <div key={item.id} className="employeecomp__container">
        <img src={item.employeeImage} alt="" className="employee__img" />
        <span className="employee__name">{item.employeeName}</span>
        <span className="employee__role">{item.employeeJobDescription}</span>
        <Rating />
        {/* <button
          className="delete__employee"
            onClick={() => deleteImageByUrl(item)}
        >
          Delete
        </button> */}
      </div>
    );
  }
};

export default BusinessPageViewer;
