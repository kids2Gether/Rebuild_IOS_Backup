import React, { useContext, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import UserInfo from "./UserInfo";
import Permissions from "../../components/Permissions";
import { useDispatch, useSelector } from "react-redux";
import { delUser, setMembership } from "../../reducer/userReducer";
import CustomButton from "../../components/CustomButton";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../contexts/AppContext";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { clearUserMarkers } from "../../reducer/mapReducer";

export default function Profile() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // membership temporary controller
  const [member, setMember] = useState(true);
  const { setLoading, setAwaitLoading } = useContext(AppContext);
  const { setDeleteAccountController } = useContext(UserContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setAwaitLoading(true);
      setLoading(true);
      (async () => {
        let token = user.user.token;
        const options = {
          method: "GET",
          url: "https://www.kids2gether.com.br/wp-json/k2g/appaccount/membership",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        };

        try {
          const response = await axios.request(options);
          setAwaitLoading(false);
          setLoading(false);
          if (response.data.membership) {
            setMember(true);
            dispatch(setMembership(true));
          } else {
            setMember(false);
            dispatch(setMembership(false));
          }
        } catch (error) {
          setAwaitLoading(false);
          setLoading(false);
          Alert.alert("", "Ocorreu um error");
          navigation.navigate("home");
        }
      })();
    } else {
      setAwaitLoading(false);
      setLoading(false);
    }
  }, [isFocused]);

  return (
    <Animated.View
      exiting={SlideInLeft}
      entering={SlideInRight}
      style={styles.container}
    >
      <View style={styles.align_content}>
        <Header title={"PERFIL"} color={"#333"} />
        <UserInfo
          email={user.user.user_email}
          name={user.user.user_display_name}
        />
        <Permissions />
        <View style={styles.membership_content}>
          <Text>Assinatura</Text>
          {member ? (
            <CustomButton
              value={"GERENCIAR ASSINATURA"}
              onPress={() => navigation.navigate('profile-routes', { screen: "subscription" })}
            />
          ) : (
            <CustomButton
              value={"ASSINAR"}
              onPress={() => navigation.navigate('profile-routes', { screen: "get-premium" })}
            />
          )}
        </View>
      </View>
      <View style={styles.align_content}>
        <View style={styles.signin_content}>
          <TouchableOpacity
            onPress={() => console.log("Página externa de termos")}
          >
            <Text>Termos de Uso e Políticas de Privacidade</Text>
          </TouchableOpacity>
          <CustomButton
            value={"APAGAR CONTA"}
            onPress={() => setDeleteAccountController(true)}
            sx={{ backgroundColor: "#f00" }}
          />
          <CustomButton
            value={"DESCONECTAR"}
            onPress={async () => {
              dispatch(delUser());
              dispatch(clearUserMarkers());
              try {
                await AsyncStorage.removeItem("K2G");
              } catch (error) {
                console.log(error);
              }
              console.log("out");
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}
