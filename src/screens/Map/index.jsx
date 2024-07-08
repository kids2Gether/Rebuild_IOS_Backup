import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  watchPositionAsync,
} from "expo-location";
import { styles } from "./styles";
import MapView from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppContext } from "../../contexts/AppContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setUserMarkers } from "../../reducer/mapReducer";
import axios from "axios";
import MarkerContent from "./components/MarkerContent";
import MarkerVisited from "./components/MarkerVisited";
import MarkerWant from "./components/MarkerWant";

export default function Map() {
  const {
    setMapController,
    setOffCanvasController,
    setOffCanvasVariant,
    setPinController,
    setPinData,
    setMapFilterController,
    showContentMarker,
    showVisitedMarker,
    showWantMarker,
  } = useContext(AppContext);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const user = useSelector((state) => state.user);
  const { contentMarkers, userMarkers } = useSelector((state) => state.map);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { setLoaderController } = useContext(AppContext);

  const requestLocationPermission = async () => {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (granted) {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);
      } else {
        setLocation({
          coords: {
            accuracy: 46.96900177001953,
            altitude: 37.400001525878906,
            altitudeAccuracy: 6.70107364654541,
            heading: 302.0387268066406,
            latitude: -22.9489938430059,
            longitude: -43.211185549432386,
            speed: 0.10521680116653442,
          },
          mocked: false,
          timestamp: 1692460254005,
        });
      }
    } catch (error) {
      setLocation({
        coords: {
          accuracy: 46.96900177001953,
          altitude: 37.400001525878906,
          altitudeAccuracy: 6.70107364654541,
          heading: 302.0387268066406,
          latitude: -22.9489938430059,
          longitude: -43.211185549432386,
          speed: 0.10521680116653442,
        },
        mocked: false,
        timestamp: 1692460254005,
      });
    }
  };

  const handleCenterUserPosition = async () => {
    try {
      await watchPositionAsync(
        {
          accuracy: LocationAccuracy.High,
          timeOut: 1000,
          distanceInterval: 1,
        },
        (newPosition) => {
          setLocation(newPosition);
          mapRef.current?.animateCamera({
            center: newPosition.coords,
            pitch: 0,
          });
        }
      );
    } catch (error) {
      setLocation({
        coords: {
          accuracy: 46.96900177001953,
          altitude: 37.400001525878906,
          altitudeAccuracy: 6.70107364654541,
          heading: 302.0387268066406,
          latitude: -22.9489938430059,
          longitude: -43.211185549432386,
          speed: 0.10521680116653442,
        },
        mocked: false,
        timestamp: 1692460254005,
      });
    }
  };

  const getUserMarkers = async () => {
    const options = {
      method: "GET",
      url: `https://us-central1-kids2gether-4ca94.cloudfunctions.net/usermarkers/${user.user.user_id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer" + user.user.token,
      },
    };
    try {
      const USER_MARKERS = await axios.request(options);
      dispatch(setUserMarkers(USER_MARKERS.data));
    } catch (error) {
      console.error(error);
    }
  };

  const selectedPin = (index) => {
    setOffCanvasController(true);
    setOffCanvasVariant("edit-pin");
    const data = userMarkers.filter((item) => item.id === index);
    setPinData(data);
  };

  const onContentPinClick = (id) => {
    navigation.navigate("map-routes", { screen: "map-trip", params: id });
  };

  const handleLongPress = (location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.03,
    });
    if (user.user === null) {
      setPinController(true);
    } else {
      setPinData(location);
      setOffCanvasController(true);
      setOffCanvasVariant("create-pin");
    }
  };

  const onFilterPress = () => {
    setMapFilterController(true);
  };

  useEffect(() => {
    (async () => {
      setMapController(true);
      await requestLocationPermission();
      setLoaderController(true);
    })();
  }, []);

  useEffect(() => {
    if (user.user !== null) {
      getUserMarkers();
    }
  }, [user.user]);

  return (
    <View style={styles.container}>
      <View style={styles.header_content}>
        <Text style={styles.header_title}>Mapa</Text>
      </View>
      <TouchableOpacity
        style={styles.filter_icon}
        onPress={() => onFilterPress()}
      >
        <Icon name="filter-alt" size={30} color="#000" />
      </TouchableOpacity>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map_view}
            initialRegion={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsMyLocationButton={false}
            showsUserLocation={true}
            followsUserLocation={false}
            toolbarEnabled={false}
            showsCompass={false}
            onLongPress={(coordinate) => {
              handleLongPress(coordinate.nativeEvent.coordinate);
            }}
          >
            {showVisitedMarker &&
              userMarkers !== null &&
              userMarkers.map(
                (item) =>
                  item.type === "visited" && (
                    <MarkerVisited
                      key={item.id}
                      coordinate={item.coordinates}
                      content={item.content}
                      onPress={(e) => selectedPin(item.id)}
                    />
                  )
              )}
            {showWantMarker &&
              userMarkers !== null &&
              userMarkers.map(
                (item) =>
                  item.type === "want" && (
                    <MarkerWant
                      key={item.id}
                      coordinate={item.coordinates}
                      content={item.content}
                      onPress={(e) => selectedPin(item.id)}
                    />
                  )
              )}
            {contentMarkers !== null &&
              contentMarkers.map((item, index) => (
                <MarkerContent
                  key={item.id}
                  coordinate={item.coordinates}
                  content={item.content}
                  onPress={(e) => onContentPinClick(item.id)}
                  onLayout={() => {
                    if (index === contentMarkers.length - 1) {
                      setLoaderController(false);
                    }
                  }}
                />
              ))}
          </MapView>
          <TouchableOpacity
            onPress={() => handleCenterUserPosition()}
            style={styles.gps_container}
          >
            <View style={styles.gps_content}>
              <Icon name={"gps-fixed"} size={22} color="#000" />
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
