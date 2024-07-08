import React, { useContext, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { TextInput, View } from "react-native";
import { styles } from "./styles";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../../../reducer/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../../contexts/AppContext";

export default function FormAuth({ onBlur, onChange, value }) {
  const user = useSelector((state) => state.user);
  const { setLoaderController, setKErrorController, setKError } =
    useContext(AppContext);
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const handleSignIn = async (data) => {
    Keyboard.dismiss();
    setEmailStatus("");
    setPasswordStatus("");
    let email = data.email;
    let password = data.password;
    let regexEmail =
      /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
    if (!email) {
      return setEmailStatus("E-mail é obrigatório");
    }

    if (!regexEmail.test(email)) {
      return setEmailStatus("E-mail inválido");
    }
    if (!password) {
      return setPasswordStatus("Senha é obrigatória");
    }

    //Here we do the authentication
    const options = {
      method: "POST",
      url: "https://www.kids2gether.com.br/wp-json/simple-jwt-authentication/v1/token",
      headers: { "Content-Type": "application/json" },
      data: {
        username: email,
        password: password,
      },
    };

    try {
      setLoaderController(true);
      const response = await axios.request(options);
      dispatch(setUser(response.data));
      await AsyncStorage.setItem("K2G", JSON.stringify(response.data));
      setLoaderController(false);
    } catch (error) {
      setLoaderController(false);
      if (error.response.status === 403) {
        setKError("Login ou senha inválidos! Por favor, tente novamente.");
        setKErrorController(true);
        return;
      }
      if (error.response.status === 404) {
        setKError("Problemas de conexão");
        setKErrorController(true);
        return;
      }
      if (error.response.status === 503) {
        setKError(
          "Serviço indisponível. Por favor, tente novamente mais tarde."
        );
        setKErrorController(true);
        return;
      }
    }
  };

  return (
    <View style={styles.form_container}>
      <View style={styles.form_input_container}>
        <Icon name="user" size={20} color="#fff" />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.form_input}
                placeholderTextColor={"#fff"}
                onBlur={onBlur}
                onFocus={() => setEmailStatus("")}
                onChangeText={onChange}
                value={value}
                placeholder="E-mail"
              />
              <Text style={styles.label_status}>{emailStatus}</Text>
            </>
          )}
        />
      </View>
      <View style={styles.form_input_container}>
        <Icon name="lock" size={20} color="#fff" />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.form_input}
                placeholderTextColor={"#fff"}
                onBlur={onBlur}
                onFocus={() => setPasswordStatus("")}
                onChangeText={onChange}
                value={value}
                placeholder="Senha"
                secureTextEntry={true}
              />
              <Text style={styles.label_status}>{passwordStatus}</Text>
            </>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.actions_button}
        onPress={handleSubmit(handleSignIn)}
      >
        <Text style={styles.actions_text}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}
