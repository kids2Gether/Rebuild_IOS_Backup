import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card_container: {
      width: '100%',
      height: 180,
      alignItems: "center",
      paddingHorizontal: 10,
    },
    bg_image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      alignItems: "center",
      justifyContent: "center",
    },
    bg_overlay: {
      width: "100%",
      height: 180,
      position: "absolute",
      opacity: 0.4,
    },
    title_align_container: {
      height: 180,
      position: "absolute",
      zIndex: 3,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    title_post: {
      color: "#fff",
      fontSize: 18,
      fontWeight: 800,
      fontFamily: "Roboto_bold_italic",
      textAlign: "center",
      padding: 5,
      textShadowRadius: 5,
      textShadowColor: "#000",
      textShadowOffset: { width: 0, height: 0 },
    },
  });
  