import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer } from './reducer';
import AsyncStorage from '@react-native-community/async-storage';

export const StateContext = createContext();

export const StateProvider = ({ initialState, children }) => {
  const [appState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function storeData() {
      try {
        await AsyncStorage.setItem('todoItems', JSON.stringify(appState.todos));
      } catch (e) {
        console.log({ catchOnStoring: e });
      }
    }

    storeData();
  }, [appState]);

  return <StateContext.Provider value={{ appState, dispatch }}>{children}</StateContext.Provider>;
};

export const useStateValue = () => useContext(StateContext);
