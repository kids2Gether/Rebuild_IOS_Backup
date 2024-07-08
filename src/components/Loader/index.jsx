import React from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { styles } from "./styles";

export default function Loader() {
  return (
    <View style={styles.modal_container}>
      <Animated.View entering={FadeIn} style={styles.modal_overlay} />
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={styles.modal_content}
      >
        <View style={styles.modal_main}>
          <ActivityIndicator size="large" color="green" />
        </View>
      </Animated.View>
    </View>
  );
}
