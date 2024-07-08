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
  const { setLoaderController, setKErrorController, setKError, setPopUpController } =
    useContext(AppContext);
  const user = useSelector((state) => state.user);
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [nomeStatus, setNomeStatus] = useState("");

  dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const handleRegister = async (data) => {
    Keyboard.dismiss();
    setNomeStatus("");
    setEmailStatus("");
    setPasswordStatus("");

    let name = data.name;
    let email = data.email;
    let password = data.password;
    let confirm_password = data.confirm_password;

    let regexEmail =
      /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

    if (!name) {
      return setNomeStatus("Insira um nome de usuário");
    }
    if (!email) {
      return setEmailStatus("Insira um email");
    }
    if (!regexEmail.test(email)) {
      return setEmailStatus("E-mail inválido");
    }
    if (password.length < 6) {
      return setPasswordStatus("Minimo 6 caracteres");
    }
    if (password !== confirm_password) {
      return setPasswordStatus("Confirmação não coincide");
    }

    const optionsRegister = {
      method: "POST",
      url: "https://www.kids2gether.com.br/wp-json/k2g/appaccount",
      headers: { "Content-Type": "application/json" },
      data: {
        username: name,
        email: email,
        password: password,
      },
    };

    const optionsLogin = {
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
      //Here we do the Registration
      const responseRegister = await axios.request(optionsRegister);
      //Here the automatic Login
      const responseLogin = await axios.request(optionsLogin);
      dispatch(setUser(responseLogin.data));
      await AsyncStorage.setItem("K2G", JSON.stringify(responseLogin.data));
      //Here do the registration in firebase
      let fire_id = Number(responseLogin.data.user_id);
      const optionsRegisterFirebase = {
        method: "POST",
        url: `https://us-central1-kids2gether-4ca94.cloudfunctions.net/users/${fire_id}`,
        headers: { "Content-Type": "application/json" },
        data: {
          id: fire_id,
          name: name,
          email: email,
        },
      };
      const responseRegisterFirebase = await axios.request(
        optionsRegisterFirebase
      );
      console.log(responseRegisterFirebase);
      setLoaderController(false);
      setTimeout(() => { setPopUpController(true) }, 50000)
    } catch (error) {
      console.log(error);
      setLoaderController(false);
      if (error.response.status === 400) {
        setKError("Nome de usuário indisponível, tente novamente.");
        setKErrorController(true);
        return;
      }
      if (error.response.status === 404) {
        setKError("Verifique sua conexão");
        setKErrorController(true);
        return;
      }
      if (error.response.status === 503) {
        setKError(
          "Este serviço não está disponível. Por favor, tente mais tarde."
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
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.form_input}
                placeholderTextColor={"#fff"}
                onBlur={onBlur}
                onFocus={() => setNomeStatus("")}
                onChangeText={onChange}
                value={value}
                placeholder="Nome"
              />
              <Text style={styles.label_status}>{nomeStatus}</Text>
            </>
          )}
        />
      </View>
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
                placeholder="Email"
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
      <View style={styles.form_input_container}>
        <Icon name="lock" size={20} color="#fff" />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                style={styles.form_input}
                placeholderTextColor={"#fff"}
                onBlur={onBlur}
                onFocus={() => setPasswordStatus("")}
                onChangeText={onChange}
                value={value}
                placeholder="Confirmação da Senha"
                secureTextEntry={true}
              />
              <Text style={styles.label_status}>{passwordStatus}</Text>
            </>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.actions_button}
        onPress={handleSubmit(handleRegister)}
      >
        <Text style={styles.actions_text}>CRIAR</Text>
      </TouchableOpacity>
    </View>
  );
}
