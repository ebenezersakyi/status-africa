import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";

import { Link, useNavigate } from "react-router-dom";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebase";
const firestore = getFirestore(app);
const auth = getAuth(app);

const Home = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [searchOutput, setSearchOutput] = useState([]);

  useEffect(() => {
    let debounceTimer;
    const debounceSearch = () => {
      if (inputValue.length > 2) {
        // setSearchOutput([]);
        searchBusinesses();
        // console.log("Searching for:", inputValue);
      }
    };
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(debounceSearch, 500);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [inputValue]);

  const searchBusinesses = async () => {
    try {
      const businessRef = collection(firestore, "bussinesses");
      const q = query(businessRef, where("name", ">=", inputValue));

      const querySnapshot = await getDocs(q);
      // console.log("Found document:", querySnapshot.docs);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Do something with the document data
        // console.log("Found document:", data);
        setSearchOutput([data]);
      });
      if (querySnapshot.docs.length < 1) {
        setSearchOutput([]);
      }
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  };

  return (
    <div className="home__container">
      <Header />
      <div className="home__content">
        <div className="hero__text__container">
          <span className="hero__text">statusAfrik</span>
        </div>

        <div className="main__section">
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
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            {inputValue.length > 0 && searchOutput.length > 0 ? (
              <div className="results__container">
                {searchOutput.map((item, index) => (
                  <div
                    key={index}
                    className="business__item__div"
                    onClick={() => {
                      navigate("/businesspageviewer", {
                        state: {
                          _id: item._id,
                        },
                      });
                    }}
                  >
                    <img
                      className="business__item__img"
                      src={item.businessImage}
                      alt="business image"
                    />
                    <div className="details">
                      <span className="buss__name">{item.name}</span>
                      <span className="buss__loc">{item.cityAndCountry}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="trending__section">
          <span className="trending__title">Trending searches</span>
          {trendinBusinesss.map((item, index) => (
            <div className="business__item__div">
              <img
                className="business__item__img"
                src={item.image}
                alt="business image"
              />
              <div className="details">
                <span className="buss__name">{item.name}</span>
                <span className="buss__loc">{item.loction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
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

export default Home;
