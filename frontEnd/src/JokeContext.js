import React, { createContext, useContext, useState, useEffect } from 'react';
import apiUrl from './components/configURL';

const JokeContext = createContext();

export function useJokeContext() {
  return useContext(JokeContext);
}

export function JokeProvider({ children }) {
  const [jokes, setJokes] = useState([]);

  const fetchJokes = async () => {
    try {
      const response = await fetch(`/api/jokes`);
      const data = await response.json();
      setJokes(data);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const addJokes = (newJokes) => {
    setJokes((prevJokes) => [...prevJokes, ...newJokes]);
  };

  const value = {
    jokes,
    addJokes,
  };

  return <JokeContext.Provider value={value}>{children}</JokeContext.Provider>;
}
