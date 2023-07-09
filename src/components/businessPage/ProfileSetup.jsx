import React, { useState, useEffect, useMemo } from "react";
import "./ProfileSetup.css";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import app from "../../firebase";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/storage";

const containerStyle = {
  width: "90vw",
  height: "400px",
};

const center = {
  lat: 6.674581791420629,
  lng: -1.5732336044311523,
};

const storage = getStorage(app);
const auth = getAuth(app);

const ProfileSetup = () => {
  const history = useNavigate();
  const [showDilogue, setShowDilogue] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [cityAndCountry, setCityAndCountry] = useState("");
  const [internationalPhone, setInternationalPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [markerCoordinates, setMarkerCoordinates] = useState({
    lat: 6.674581791420629,
    lng: -1.5732336044311523,
  });

  const [businessDetails, setBusinessDetails] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  useEffect(() => {}, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onload = () => {
    setSelectedImage(file);
    // };

    // reader.readAsDataURL(file);
  };

  // const inputChange = async (e) => {
  //   setInputValue(e.target.value);
  // };

  // const mapCenter = useMemo(() => {
  //   return {  lat: -3.745,
  //     lng: -38.523, }
  // }, [])

  const submitImage = () => {
    if (selectedImage) {
      if (
        nameValue == "" ||
        cityAndCountry == "" ||
        internationalPhone == "" ||
        description == ""
      ) {
        alert("Fill all required fields");
      } else {
        const file = selectedImage;
        const storageRef = ref(
          storage,
          `businessimages/${auth.currentUser.uid}/${file.name}`
        );

        uploadBytes(storageRef, file)
          .then((snapshot) => {
            console.log("Image uploaded successfully!");
            return getDownloadURL(snapshot.ref);
          })
          .then((downloadURL) => {
            // console.log("Download URL:", downloadURL);
            submitToFirestore(downloadURL);
            // Do something with the download URL, like storing it in state or sending it to a backend API
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    } else {
      alert("Please select an image");
    }
  };

  const submitToFirestore = (item) => {
    firebase
      .firestore()
      .collection("bussinesses")
      .doc(firebase.auth().currentUser.uid)
      .set({
        email: firebase.auth().currentUser.email,
        name: nameValue,
        description: description,
        cityAndCountry: cityAndCountry,
        internationalPhone: internationalPhone,
        businessImage: item,
        coordinates: markerCoordinates,
        employees: [],
        queueInformation: {},
        websiteUrl: website,
        _id: `${
          firebase.auth().currentUser.email
        }${nameValue}${Math.random().toString(12)}`,
      })
      .then(() => {
        history("/businessprofile");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="profile__container">
      <div className="main__section__buss">
        <span className="title__buss__pg">
          Enter the name of your business (*)
        </span>
        <div
          className={
            nameValue.length > 0 ? "search__div__active" : "search__div"
          }
        >
          <div className="input__section">
            <input
              className="search__input"
              placeholder="Enter a business name"
              type="text"
              value={nameValue}
              onChange={(e) => {
                setNameValue(e.target.value);
              }}
            />
          </div>
        </div>

        <span className="title__buss__pg">Enter a city and country (*)</span>
        <div
          className={
            cityAndCountry.length > 0 ? "search__div__active" : "search__div"
          }
        >
          <div className="input__section">
            <input
              className="search__input"
              placeholder="Eg: Accra, Ghana"
              type="text"
              value={cityAndCountry}
              onChange={(e) => {
                setCityAndCountry(e.target.value);
              }}
            />
          </div>
        </div>

        <span className="title__buss__pg">
          Enter the international phone number of your business (*)
        </span>
        <div
          className={
            internationalPhone.length > 0
              ? "search__div__active"
              : "search__div"
          }
        >
          <div className="input__section">
            <input
              className="search__input"
              placeholder="Eg:  +233 123 123 123"
              type="text"
              value={internationalPhone}
              onChange={(e) => {
                setInternationalPhone(e.target.value);
              }}
            />
          </div>
        </div>

        <span className="title__buss__pg">
          Enter a description of your business (*)
        </span>
        <div
          className={
            description.length > 0 ? "search__div__active" : "search__div"
          }
        >
          <div className="input__section">
            <input
              className="search__input"
              placeholder="Enter a description"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </div>

        <span className="title__buss__pg">Enter a business website</span>
        <div
          className={
            description.length > 0 ? "search__div__active" : "search__div"
          }
        >
          <div className="input__section">
            <input
              className="search__input"
              placeholder="Enter a website"
              type="text"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="image-selector">
          <span className="title__buss__pg">
            Choose your business profile picture (*)
          </span>
          <label htmlFor="image-input" className="image-button">
            Choose Image
          </label>
          <input
            id="image-input"
            type="file"
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
        </div>

        <>
          <span className="title__buss__pg">
            Drag the marker to the location of your business (*)
          </span>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              // onLoad={onLoad}
              // onUnmount={onUnmount}
              onClick={(item) =>
                console.log(item.latLng.lat(), item.latLng.lng())
              }
            >
              {/* Child components, such as markers, info windows, etc. */}
              <Marker
                onDrag={(data) =>
                  setMarkerCoordinates({
                    lat: data.latLng.lat(),
                    lng: data.latLng.lng(),
                  })
                }
                draggable={true}
                position={markerCoordinates}
              />
            </GoogleMap>
          ) : (
            <></>
          )}
        </>
      </div>
      <button className="submit-button" onClick={submitImage}>
        Submit
      </button>

      {/* {showDilogue && <Dialogue />} */}
    </div>
  );

  function Dialogue() {
    return (
      <div className="display__alert__background">
        <div className="display__alert">
          <span>
            Please note that at this time, we are only able to accept business
            listings that are available in the Google Business API. This helps
            us maintain the accuracy and reliability of the information provided
            on our website. If your business is already listed on Google, you
            can easily add it to our platform by following these steps:
          </span>
          <li>
            Search for your business using the same name and address as listed
            on Google in the input below.
          </li>
          <li>Select your business from the search results.</li>
          <li>
            Verify your business email address. An OTP will be sent to the email
            address associated with your business on Google. Retrieve the OTP
            from your business email inbox. Enter the OTP on our website to
            confirm ownership.
          </li>
          <li>
            Verify the details and complete any additional information required.
          </li>
          <li>Submit your business for review.</li>

          <span>
            If your business is not yet listed on Google, we recommend creating
            a Google My Business listing first. Once your business is available
            in the Google Business API, you can come back to our website and add
            it to our platform.
          </span>
          <button
            onClick={() => setShowDilogue(false)}
            className="close__button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

const trendinBusinesss = [
  {
    name: "Asasefie",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    loction: "Accra",
  },
  {
    name: "Dzirash Enterprise",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    loction: "Accra",
  },
  {
    name: "SAS",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    loction: "Accra",
  },
  {
    name: "Asasefie360",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEUAAAD////09PTIyMjFxcXv7++RkZH7+/sMDAx3d3fn5+fs7OyUlJSmpqacnJxCQkJRUVHe3t5MTExpaWnW1tYqKipZWVkzMzO6urpiYmJxcXGzs7MVFRU9PT2KioohISGBgYF3MV/gAAAC1ElEQVR4nO2Yy4KrIAxACZX6RMVXtVbr/3/lBNo6apnVFV3cnMW0wUXPJIAExgiCIAiCIAiCIAiCIAhCk93ONhi4epxs4ANEwZkGuQBE1ecZFDEYqtMcBg5v1Em1KHyYiU7JQyNggXoeb5CvDCA9vhSZvzJIDhdgzdrgeoKBsBmkzXEGhd0A4uwoA/s8SPErP+id1XBbDqQJRHGIgbDlQH72qAMcMm4zSOcBMbg2KMBmIBdD3PGcbKw5kKtBt7WwG6SrQfCUQ4fCuicma4P+AsLZ2mzAZrDOgX9pMVPcUR46636wMVCVOUnFuQuDzTwYbQYQxe9aOdmrLzYDtp4di8hzrTC/nfkfBs4Vfs8HS4UyPU5hcUJZKJSrmeFWYXlGmhX8TofpMQqrU9pHwb+/4vQIhfU58aNQfgYS9wqbkyrfGMx5cKcwbkb57zz4kLhV2BoYhbUBY1eXCl8GRqHbDl7dKXwbaIXyezRxpWAxYNy3GOg8OFGw9o3CaoDr4uJAwd6t/dnDHdjc/WfkYahXX5b0o75pDMNQH4w6KXE2lKEOC/23y8KS3cP3431R2CmhiN521IM98aN/78ZSP8MP005UCYjA7Jnp7gr6UDQwD1TIcXlOGClWx9DjPjRUoKTsJPiyHxOImIBK9l871r9SQlThT7cQdXk+sB68GOpnBF7RNM8K+luGTZVgT0yMVpC3/esgoZVwYQXmOJpYoCCsYGKjTn3GKp2iDAsRifsrCxjv3s9UIEdzvThh4UOcCo0HLWO3lAO/YSH6tkYFDuFLAeO9rwHr1ykgT9o72rSTidSAP4RPOvRjzBSCvQvh4Aruji8ebNXGHvjFh9GDuPXAbyJQWISsAh6LdKnAY763RY/zH99UVaDXn1cr/W8DTObyb9RzAdforBCI11rdl4e5XQ1wUxqa2zIsdPcYaPSHGQ0+MUEQBEEQBEEQBEEQBEEQBEGcyw/jgR7TpB6fyAAAAABJRU5ErkJggg==",
    loction: "Accra",
  },
];

export default ProfileSetup;

// useEffect(() => {
//   const delay = 2000;
//   let timerId;

//   const debounceApiCall = () => {
//     clearTimeout(timerId); // Clear the previous timer
//     timerId = setTimeout(() => {
//       // Make your API call here using the searchTerm value
//       fetchBusinessInfo();
//       // console.log("API call with search term:", inputValue);
//     }, delay);
//   };
//   if (inputValue.length > 3) {
//     debounceApiCall();
//   } else {
//     setSetSearchResults([]);
//   }
//   return () => {
//     clearTimeout(timerId);
//   };
// }, [inputValue]);

// const fetchBusinessInfo = async () => {
//   setSetSearchingResults(true);

//   const service = new google.maps.places.PlacesService(
//     document.createElement("div")
//   );
//   const request = {
//     query: inputValue,
//     // fields: ["name", "formatted_phone_number"],
//   };

//   service.textSearch(request, (results, status) => {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       if (results && results.length > 0) {
//         console.log(results);
//         setSetSearchResults(results);
//       } else {
//         setSetSearchingResults(false);
//       }
//     } else {
//       setSetSearchingResults(false);
//     }
//   });
// };

// const getBusinessNumAndOtherDeets = (item) => {
//   const service = new google.maps.places.PlacesService(
//     document.createElement("div")
//   );
//   const request = {
//     placeId: item.place_id,
//     // fields: ["name", "formatted_phone_number"],
//   };

//   service.getDetails(request, (results, status) => {
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       if (results) {
//         setSelectedBusiness({
//           name: item.name,
//           business_status: item.siness_status,
//           icon: item.icon,
//           place_id: item.place_id,

//           formatted_address: results.formatted_address,
//           international_phone_number: results.international_phone_number,
//           formatted_phone_number: results.formatted_phone_number,
//         });
//         setInputValue("");
//         console.log("getBusinessNumAndOtherDeets", [[item, results]]);
//       } else {
//         alert("Error");
//       }
//     } else {
//     }
//   });
// };
