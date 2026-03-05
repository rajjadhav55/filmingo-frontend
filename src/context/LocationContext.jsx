import React, { createContext, useContext, useState, useEffect } from 'react';
import { exploreAPI } from '../api/exploreAPI';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocationState] = useState(() => {
    return localStorage.getItem('userLocation') || 'Mumbai';
  });
  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locs = await exploreAPI.getLocations();
        const list = Array.isArray(locs) ? locs : [];
        if (list.length > 0) {
          setLocationsList(list);
          // If current location isn't in the list, fallback
          const current = localStorage.getItem('userLocation') || 'Mumbai';
          if (!list.includes(current) && list.length > 0) {
             setLocationState(list[0]);
             localStorage.setItem('userLocation', list[0]);
          }
        }
      } catch (e) {
        console.error('Failed to load locations', e);
      }
    };
    loadLocations();
  }, []);

  const setLocation = (newLocation) => {
    setLocationState(newLocation);
    localStorage.setItem('userLocation', newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, locationsList }}>
      {children}
    </LocationContext.Provider>
  );
};
