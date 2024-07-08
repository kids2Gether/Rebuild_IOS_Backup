import React, { useContext } from "react";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { styles } from "./styles";
import { AppContext } from "../../../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";
import alert from "../../../../assets/alert.png";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";
import { delUser } from "../../../reducer/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

export default function DeleteModal({ type }) {
  const { setLoaderController } = useContext(AppContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { setDeleteAccountController, setCancelSubcriptionController } =
    useContext(UserContext);

  const handleDeleteAccount = async () => {
    //Here we do the req to del the account
    try {
      setDeleteAccountController(false);
      let token = user.user.token;
      dispatch(delUser());
      await AsyncStorage.removeItem("K2G");
      const options = {
        method: "POST",
        url: "https://us-central1-kids2gether-4ca94.cloudfunctions.net/users/delete",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          token: token,
        },
      };
      await axios.request(options);
    } catch (error) {
      if (error.response.status === 404) {
        return;
      }
      Alert.alert("", "Ocorreu um erro! Tente novamente.");
    }
  };

  const handleCancelMembership = async () => {
    setCancelSubcriptionController(false);
    let token = user.user.token;
    let myuser = user.user.user_id;
    try {
      //req
      const options = {
        method: "POST",
        url: "https://us-central1-kids2gether-4ca94.cloudfunctions.net/subscriptions/cancel",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          user: myuser,
        },
      };
      await axios.request(options);
    } catch (error) {
      Alert.alert("", "Ocorreu um erro! Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_content}>
        <Text style={styles.header_title}>ATENÇÃO!</Text>
      </View>
      <View>
        <Image
          source={alert}
          style={{ ...styles.imagen_icon, width: 75, height: 70 }}
        />
      </View>
      <View style={styles.main_content}>
        {type === "delete" ? (
          <Text style={[styles.main_text]}>
            Você está prestes a excluir sua conta no Kids2Gether. Essa operação
            não poderá ser desfeita. Tem certeza de que deseja continuar?
          </Text>
        ) : (
          <Text style={[styles.main_text]}>
            Você está prestes a cancelar sua assinatura no Kids2Gether. Essa
            ação é irreversível. Tem certeza de que deseja continuar?
          </Text>
        )}
      </View>
      <View style={styles.footer_content}>
        <TouchableOpacity
          style={{ ...styles.actions_button, backgroundColor: "#f00" }}
          onPress={async () => {
            //cancel subscription allways
            setLoaderController(true);
            await handleCancelMembership();
            if (type === "delete") {
              await handleDeleteAccount();
            }
            setLoaderController(false);
            navigation.goBack();
          }}
        >
          {type === "delete" ? (
            <Text style={styles.actions_text}>APAGAR CONTA</Text>
          ) : (
            <Text style={styles.actions_text}>CANCELAR ASSINATURA</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actions_button}
          onPress={() =>
            type === "delete"
              ? setDeleteAccountController(false)
              : setCancelSubcriptionController(false)
          }
        >
          <Text style={styles.actions_text}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
