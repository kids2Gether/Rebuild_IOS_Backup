import React, { useContext, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { TextInput, View } from "react-native";
import { styles } from "./styles";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AppContext } from "../../../contexts/AppContext";

export default function FormAuth({ onBlur, onChange, value }) {
  const {
    setLoaderController,
    setRecoveryErrorController,
    setRecoveryOKController,
  } = useContext(AppContext);
  const [emailStatus, setEmailStatus] = useState("");

  dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const handleRecovery = async (data) => {
    Keyboard.dismiss();
    setEmailStatus("");

    let email = data.email;
    let regexEmail =
      /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;

    if (!email) {
      return setEmailStatus("O email é obrigatório");
    }
    if (!regexEmail.test(email)) {
      return setEmailStatus("E-mail inválido");
    }

    const optionsRecovery = {
      method: "POST",
      url: "https://www.kids2gether.com.br/wp-json/k2g/appaccount/recovery",
      headers: { "Content-Type": "application/json" },
      data: { user_login: email },
    };

    try {
      setLoaderController(true);
      //Here we do the Recovery
      const responseRegister = await axios.request(optionsRecovery);
      setLoaderController(false);
      setRecoveryOKController(true);
    } catch (error) {
      console.log(error);
      setLoaderController(false);
      if (error.response.status === 401) {
        return setRecoveryErrorController(true);
      }
      if (error.response.status === 404) {
        return Alert.alert("", "Problemas de conexão");
      }
      if (error.response.status === 503) {
        return Alert.alert(
          "",
          "Serviço indisponível. Por favor, tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <View style={styles.form_container}>
      <View>
        <Text style={styles.text_info}>
          Forneça o email usado no cadastro e enviaremos as instruções de recuperação para sua caixa de entrada.
        </Text>
      </View>
      <View style={styles.form_input_container}>
        <Icon name="envelope" size={20} color="#fff" />
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

      <TouchableOpacity
        style={styles.actions_button}
        onPress={handleSubmit(handleRecovery)}
      >
        <Text style={styles.actions_text}>ENVIAR</Text>
      </TouchableOpacity>
    </View>
  );
}
