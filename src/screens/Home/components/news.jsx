import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { FlatList } from "react-native";
import PostCard from "../../../components/PostCard";
import { getFooterColor } from "../../../components/TypeIcon/utils/iconTypes";
import { useNavigation } from "@react-navigation/core";

export default function News({ data }) {
  const navigation = useNavigation();

  const handleClickNews = (id, icon) => {
    navigation.navigate("tips-routes", {
      screen: "news",
      params: { id, icon },
    });
  };

  return (
    <View>
      <Text
        style={{
          fontFamily: "FredokaOne",
          color: "black",
          fontSize: 26,
          marginLeft: 15,
          marginBottom: 5,
        }}
      >
        Novidades
      </Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              onPress={() =>
                handleClickNews(item.id, item._embedded[`wp:term`][0][0].slug)
              }
              id={item.id}
              title={item.title.rendered}
              backgroundImage={{
                uri: `${item.yoast_head_json.og_image[0].url}`,
              }}
              icon={item._embedded[`wp:term`][0][0].slug}
              iconSize={30}
              footerColor={getFooterColor(item._embedded[`wp:term`][0][0].slug)}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={{ marginLeft: 15 }}>Nenhuma novidade no momento</Text>
      )}
    </View>
  );
}
