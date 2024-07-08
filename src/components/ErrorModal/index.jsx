import React, { useContext } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import alert from "../../../assets/alert.png";
import { AppContext } from "../../contexts/AppContext";

export default function ErrorModal() {
  const { setKErrorController, setKError, kError } = useContext(AppContext);
  const navigation = useNavigation();

  const handleGoBack = () => {
    setKErrorController(false);
    setKError("Ocorreu um error, intente novamente");
    navigation.goBack();
  };

  return (
    <View style={styles.modal_container}>
      <Animated.View entering={FadeIn} style={styles.modal_overlay} />
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={styles.modal_content}
      >
        <View style={styles.container}>
          <View style={styles.header_content}>
            <Text style={styles.header_title}>ERROR</Text>
          </View>
          <View>
            <Image
              source={alert}
              style={{ ...styles.imagen_icon, width: 75, height: 70 }}
            />
          </View>
          <View style={styles.main_content}>
            <Text style={[styles.main_text]}>{kError}</Text>
          </View>
          <View style={styles.footer_content}>
            <TouchableOpacity
              style={styles.actions_button}
              onPress={() => handleGoBack()}
            >
              <Text style={styles.actions_text}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.modal_main}></View>
      </Animated.View>
    </View>
  );
}
