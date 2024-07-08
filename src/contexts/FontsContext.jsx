import { useFonts } from "expo-font";
import { createContext, useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import FredokaOne from "../../assets/fonts/Fredoka_One/FredokaOne-Regular.ttf";
import Roboto_bold from "../../assets/fonts/Roboto/Roboto-Bold.ttf";
import Roboto_bold_italic from "../../assets/fonts/Roboto/Roboto-BoldItalic.ttf";
import Roboto_italic from "../../assets/fonts/Roboto/Roboto-Italic.ttf";
import Roboto_regular from "../../assets/fonts/Roboto/Roboto-Regular.ttf";
import { setUser } from "../reducer/userReducer";
import { setContentMarkers } from "../reducer/mapReducer";
import { setLocals } from '../reducer/localsReducer';
import axios from "axios";

export const FontsContext = createContext({});

export default function FontsProvider({ children }) {
  const dispatch = useDispatch();

  const GET_CONTENT_MARKERS = async () => {
    const options = {
      method: 'GET',
      url: 'https://www.kids2gether.com.br/wp-json/k2g/map',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    try {
      const CONTENT_MARKERS = await axios.request(options);
      dispatch(setContentMarkers(CONTENT_MARKERS.data))
    } catch (error) {
      console.error(error)
    };
  }

  const GET_LOCALS = async () => {
    const options = {
      method: 'GET',
      url: 'https://www.kids2gether.com.br/wp-json/wp/v2/local',
      params: {per_page: '100'}
    };
    try {
      let response = await axios.request(options);
      dispatch(setLocals(response.data))
    } catch (error) {
    }
  }

  const [fontsLoaded] = useFonts({
    FredokaOne,
    Roboto_bold,
    Roboto_bold_italic,
    Roboto_italic,
    Roboto_regular,
  });

  useEffect(() => {
    GET_CONTENT_MARKERS();
    GET_LOCALS();

    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
    //Here we can search for user in async storage
    async function getLocalUser() {
      try {
        const storage_user = await AsyncStorage.getItem("K2G");
        if (storage_user !== null) {
          dispatch(setUser(JSON.parse(storage_user)));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getLocalUser();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <FontsContext.Provider
      value={{
        onLayout,
      }}
    >
      {children}
    </FontsContext.Provider>
  );
}
