import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { ImageBackground } from "react-native";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { useRef } from "react";
import { useState } from "react";
import ScrollToTop from "../../components/ScrollToTop";

export default function Tips() {
  const tips = useSelector((state) => state.tips);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [scroll, setScroll] = useState(0);

  const handleClickTips = (id) => {
    navigation.navigate("tips-routes", {screen: 'selected-tip', params: { id: id }});
  };

  return (
    <>
      <ScrollView
        style={[styles.tips_container]}
        ref={scrollViewRef}
        onScroll={(event) => setScroll(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.header_content}>
          <Header title={"DICAS"} color={"#fff"} />
          <View style={styles.background_overlay}></View>
          <ImageBackground
            source={{
              uri: "https://cf.ltkcdn.net/family/images/orig/200821-2121x1414-family.jpg",
            }}
            style={styles.background_image}
          ></ImageBackground>
          <View style={styles.align_title}>
            <Text style={styles.bg_title}>NOSSAS DICAS</Text>
          </View>
        </View>
        <View style={styles.main_content}>
          {tips.tips.map((item) => (
            <PostCard
              onPress={() => handleClickTips(item.id)}
              key={item.id}
              setStyle={styles.post_card}
              setTitleStyle={{
                marginTop: 100,
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
              }}
              cardBottom={true}
              title={item.title.rendered}
              backgroundImage={{
                uri: `${item.yoast_head_json.og_image[0].url}`,
              }}
            />
          ))}
        </View>
      </ScrollView>
      <ScrollToTop reference={scrollViewRef} controller={scroll} />
    </>
  );
}
