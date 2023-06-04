import React, { useState, useEffect } from "react";
import "./BusinessPage.css";

import { Map, GoogleApiWrapper } from "google-maps-react";

import axios from "axios";

const Profile = ({ google }) => {
  const [showDilogue, setShowDilogue] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSetSearchResults] = useState([]);
  const [searchingResults, setSetSearchingResults] = useState(false);

  const [selectedBusiness, setSelectedBusiness] = useState({});

  useEffect(() => {}, []);

  useEffect(() => {
    const delay = 2000;
    let timerId;

    const debounceApiCall = () => {
      clearTimeout(timerId); // Clear the previous timer
      timerId = setTimeout(() => {
        // Make your API call here using the searchTerm value
        fetchBusinessInfo();
        // console.log("API call with search term:", inputValue);
      }, delay);
    };
    if (inputValue.length > 3) {
      debounceApiCall();
    } else {
      setSetSearchResults([]);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  const fetchBusinessInfo = async () => {
    setSetSearchingResults(true);
    //   const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

    //   const placeId = "ChIJTXfPCEOb3w8R7oPKyy17Izg";
    //   const url = `/api/maps/api/place/textsearch/json
    // ?query=restaurants
    // &key=AIzaSyBDHO8OgGVn4_ap5bsz7BRpWk-YpkZUK44`;

    //   axios
    //     .get(url)
    //     .then((response) => {
    //       console.log(response);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });

    // let map = new google.maps.Map(document.getElementById("map"));

    // var request = {
    //   query: "Museum of Contemporary Art Australia",
    //   fields: ["name", "geometry"],
    // };

    // var service = new google.maps.places.PlacesService(map);

    // service.findPlaceFromQuery(request, function (results, status) {
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     // for (var i = 0; i < results.length; i++) {
    //     //   createMarker(results[i]);
    //     // }
    //     // map.setCenter(results[0].geometry.location);
    //     console.log(results);
    //   }
    // });

    // try {
    //   const response = await axios.get(
    //     `/api/maps/api/place/details/json?placeid=ChIJTXfPCEOb3w8R7oPKyy17Izg&key=AIzaSyBDHO8OgGVn4_ap5bsz7BRpWk-YpkZUK44`
    //   );

    //   if (response.status === 200 && response.data.status === "OK") {
    //     // setPlace(response.data.result);
    //     console.error("success");
    //   }
    // } catch (error) {
    //   console.error("Error fetching place details:", error);
    // }

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      query: inputValue,
      // fields: ["name", "formatted_phone_number"],
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Assuming the first result is the desired place
        if (results && results.length > 0) {
          // const place = results[0];
          // setPlaceDetails({
          //   name: place.name,
          //   phoneNumber: place.formatted_phone_number,
          //   openingHours: place.opening_hours,
          // });
          console.log(results);
          setSetSearchResults(results);
        } else {
          setSetSearchingResults(false);
        }
      } else {
        setSetSearchingResults(false);
      }
    });
  };

  const inputChange = async (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="profile__container">
      <div className="main__section">
        <span className="title__buss__pg">Enter the name of your business</span>
        <div
          className={
            inputValue.length > 0 ? "search__div__active" : "search__div"
          }
        >
          <div className="input__section">
            <span className="searchicon__div">
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
            </span>
            <input
              className="search__input"
              placeholder="Enter a business name"
              type="text"
              value={inputValue}
              onChange={inputChange}
            />
          </div>
          {searchResults.length > 0 ? (
            <div className="results__container">
              {searchResults.map((item, index) => (
                <div key={index} className="business__item__div">
                  <img
                    className="business__item__img"
                    src={item.icon}
                    alt="business image"
                  />
                  <div className="details">
                    <span className="buss__name">{item.name}</span>
                    <span className="buss__loc">{item.formatted_address}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {showDilogue && (
        <div className="display__alert__background">
          <div className="display__alert">
            <span>
              Please note that at this time, we are only able to accept business
              listings that are available in the Google Business API. This helps
              us maintain the accuracy and reliability of the information
              provided on our website. If your business is already listed on
              Google, you can easily add it to our platform by following these
              steps:
            </span>
            <li>
              Search for your business using the same name and address as listed
              on Google in the input below.
            </li>
            <li>Select your business from the search results.</li>
            <li>
              Verify your business email address. An OTP will be sent to the
              email address associated with your business on Google. Retrieve
              the OTP from your business email inbox. Enter the OTP on our
              website to confirm ownership.
            </li>
            <li>
              Verify the details and complete any additional information
              required.
            </li>
            <li>Submit your business for review.</li>

            <span>
              If your business is not yet listed on Google, we recommend
              creating a Google My Business listing first. Once your business is
              available in the Google Business API, you can come back to our
              website and add it to our platform.
            </span>
            <button
              onClick={() => setShowDilogue(false)}
              className="close__button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
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

export default GoogleApiWrapper({
  apiKey: "AIzaSyBDHO8OgGVn4_ap5bsz7BRpWk-YpkZUK44",
})(Profile);
