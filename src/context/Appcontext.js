import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [data, setdata] = useState([]);
  const [category, setcategory] = useState("indian")
  const [loading, setloading] = useState(false);
  const [search_txt, setsearch_txt] = useState('');
  const [liked_article, setLikedArticles] = useState([]);
  const [clicked, setclicked] = useState(false);
  const [iserror, setiserror] = useState(false)
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setloading(true);
      const response = await axios.post(
        'https://news-search4.p.rapidapi.com/news',
        new URLSearchParams({
          find: category,
          sortby: 'popular',
        }),
        {
          headers: {
            // ... (rest of your code)
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key':process.env.REACT_APP_API,
            'X-RapidAPI-Host': 'news-search4.p.rapidapi.com'
          }
        }
      );
      setdata(response.data.response.filter((res) => res.image));
      setloading(false);
    } catch (error) {
      console.error(error);
      setiserror(true);
    }
  }, [category]);
  useEffect(() => {
    fetchData();
  }, [category, fetchData]);


  function handlesubmit(event) {
    setcategory(search_txt);
    navigate('/')
    event.preventDefault();
  }


  const contextValue = {
    data,
    loading,
    search_txt,
    setsearch_txt,
    setcategory,
    fetchData,
    handlesubmit,
    liked_article,
    setLikedArticles,
    clicked, setclicked,
    iserror
  };
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
