import React from "react";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import TipsCard from "../../../components/TipsCard";
import { useNavigation } from "@react-navigation/core";

export default function Tips({ data }) {
  const navigation = useNavigation();

  const handleClickTips = (id) => {
    let route_data = {
      id: id
    }
    navigation.navigate("tips-routes", { screen: "selected-tip", params: route_data })
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            fontFamily: "FredokaOne",
            color: "black",
            fontSize: 24,
            marginLeft: 15,
          }}
        >
          Nossas Dicas
        </Text>
        <TouchableOpacity
        onPress={() => navigation.navigate("tips-routes", { screen: 'tips'})}
        >
          <Text
            style={{
              fontFamily: "FredokaOne",
              color: "black",
              fontSize: 16,
              marginRight: 15,
            }}
          >
            Ver todas
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TipsCard
            onPress={(e) => handleClickTips(item.id)}
            title={item.title.rendered}
 backgroundImage={{
              uri: `${item.yoast_head_json?.og_image[0]?.url}`,
 }}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
