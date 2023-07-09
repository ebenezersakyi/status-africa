import React, { useEffect, useMemo, useState } from "react";
import "./MainBusinessPage.css";
import Footer from "../common/footer/Footer";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

// import firebase from 'fir'

import app from "../../firebase";
import { Rating } from "@mui/material";
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const MainBusinessPage = () => {
  const [businessData, setBusinessData] = useState(null);
  const [showQueueDialogue, setShowQueueDualogue] = useState(false);
  const [showAddEmployeeDialogue, setShowAddEmployeeDualogue] = useState(false);
  const [queueData, setQueueData] = useState({
    queueLength: "",
    waitTime: "",
    capacity: "",
  });

  const [employeeName, setEmployeeName] = useState("");
  const [employeeJobDescription, setEmployeeJobDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQueueData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setShowQueueDualogue(false);
  //   // onQueueSubmit(queueData);
  //   console.log("queueData", queueData);
  // };
  const updateQueueInformation = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const docRef = firebase
      .firestore()
      .collection("bussinesses")
      .doc(firebase.auth().currentUser.uid);

    docRef
      .update({
        queueInformation: {
          queueLength: queueData.queueLength,
          waitTime: queueData.waitTime,
          serviceCapacity: queueData.capacity,
          lastUpdated: currentDate.toDateString(),
        },
      })
      .then(() => {
        // console.log("Queue information updated successfully!");
        alert("Success");
        setShowQueueDualogue(false);
      })
      .catch((error) => {
        console.error("Error updating queue information:", error);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onload = () => {
    setSelectedImage(file);
    // };

    // reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const docRef = doc(firestore, "bussinesses", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Do something with the retrieved data
        setBusinessData(data);
        // console.log("Business data:", data);
      } else {
        console.log("No business data found");
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();

    if (
      employeeName == "" ||
      employeeJobDescription == "" ||
      selectedImage == null
    ) {
      alert("All fields are required");
    } else {
      const file = selectedImage;
      const storageRef = ref(
        storage,
        `employeeimages/${auth.currentUser.uid}/${file.name}`
      );

      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Image uploaded successfully!");
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          // console.log("Download URL:", downloadURL);
          addEmployeeToFireStore(downloadURL);
          // Do something with the download URL, like storing it in state or sending it to a backend API
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const addEmployeeToFireStore = async (item) => {
    const employeeObject = {
      employeeName: employeeName,
      employeeJobDescription: employeeJobDescription,
      employeeImage: item,
      id: `${Math.random().toString(36)}${employeeName}`,
      rating: [],
    };
    try {
      const docRef = doc(firestore, "bussinesses", auth.currentUser.uid);
      await updateDoc(docRef, {
        employees: firebase.firestore.FieldValue.arrayUnion(employeeObject),
      });

      fetchBusinessData();
      setShowAddEmployeeDualogue(false);
      console.log("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const deleteImageByUrl = (item) => {
    const img = item.employeeImage;
    const storageRef = ref(storage, img);
    deleteObject(storageRef)
      .then(() => {
        console.log("Image deleted successfully!");
        removeEmployee(item);
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  const removeEmployee = async (item) => {
    try {
      const docRef = doc(firestore, "bussinesses", auth.currentUser.uid);
      await updateDoc(docRef, {
        employees: arrayRemove(item),
      }).then(() => {
        fetchBusinessData();
      });
      console.log("Employee removed successfully!");
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  };

  const AddEmployeeDialogie = useMemo(() => {
    return (
      <div
        className="businesspage__dialogue__container"
        onClick={() => setShowAddEmployeeDualogue(false)}
      >
        {/* <div className="businesspage__dialogue"> */}
        <form
          className="businesspage__dialogue"
          onSubmit={handleEmployeeSubmit}
        >
          <label className="queue-label">
            Name:
            <input
              className="queue-input"
              type="text"
              required
              // name="name"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
              }}
            />
          </label>
          <label className="queue-label">
            Job description:
            <input
              className="queue-input"
              required
              type="text"
              // name="description"
              value={employeeJobDescription}
              onChange={(e) => {
                setEmployeeJobDescription(e.target.value);
              }}
            />
          </label>
          <label htmlFor="image-input" className="image-button">
            Choose Image
          </label>
          <input
            id="image-input"
            type="file"
            required
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="thumbnail"
            />
          )}
          <button className="queue-submit-btn" type="submit">
            Submit
          </button>
          <button
            style={{ marginTop: 10, background: "transparent" }}
            onClick={() => setShowAddEmployeeDualogue(false)}
          >
            Close
          </button>
        </form>
        {/* </div> */}
      </div>
    );
  }, [employeeName, employeeJobDescription, selectedImage]);

  const QueueDialogue = useMemo(() => {
    return (
      <div
        className="businesspage__dialogue__container"
        // onClick={() => setShowQueueDualogue(false)}
      >
        {/* <div className="businesspage__dialogue"> */}
        <form
          className="businesspage__dialogue"
          onSubmit={updateQueueInformation}
        >
          <label className="queue-label">
            Queue Length:
            <input
              className="queue-input"
              type="number"
              name="queueLength"
              required
              value={queueData.queueLength}
              onChange={handleChange}
            />
          </label>
          <label className="queue-label">
            Estimated Wait Time (in minutes):
            <input
              className="queue-input"
              type="number"
              name="waitTime"
              required
              value={queueData.waitTime}
              onChange={handleChange}
            />
          </label>
          <label className="queue-label">
            Service Capacity:
            <input
              className="queue-input"
              type="number"
              name="capacity"
              required
              value={queueData.capacity}
              onChange={handleChange}
            />
          </label>
          <button className="queue-submit-btn" type="submit">
            Submit
          </button>
          <button
            style={{ marginTop: 10, background: "transparent" }}
            onClick={() => setShowQueueDualogue(false)}
          >
            Close
          </button>
        </form>
        {/* </div> */}
      </div>
    );
  }, [showQueueDialogue, queueData]);

  if (businessData) {
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
        <div className="queue__info__section">
          <button
            onClick={() => setShowQueueDualogue(true)}
            className="update__queueinfo__btn"
          >
            Update queue information
          </button>
        </div>

        <div className="emplpoyee__section__container">
          <button
            className="addemployee__btn"
            onClick={() => setShowAddEmployeeDualogue(true)}
          >
            Add employee
          </button>
          <div className="employee__list__wrapper">
            {businessData.employees.map((item, index) => (
              <EmployeeComponenet item={item} key={index} />
            ))}
          </div>
        </div>

        <div className="queue___section__conotainer"></div>

        {showQueueDialogue && <>{QueueDialogue}</>}
        {showAddEmployeeDialogue && <>{AddEmployeeDialogie}</>}
        <Footer />
      </div>
    );
  }

  return (
    <div className="main__buss__contb">
      <span>Loading...</span>
    </div>
  );

  function EmployeeComponenet({ item, key }) {
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
        <Rating name="read-only" value={meanRating} readOnly />
        <button
          className="delete__employee"
          onClick={() => deleteImageByUrl(item)}
        >
          Delete
        </button>
      </div>
    );
  }
};

export default MainBusinessPage;

const pseudoEmployeeInfo = [
  {
    name: "Ebenezer Sakyi",
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    role: "CEO",
  },
  {
    name: "Ebenezer Sakyi",
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    role: "CEO",
  },
  {
    name: "Ebenezer Sakyi",
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    role: "CEO",
  },
];
