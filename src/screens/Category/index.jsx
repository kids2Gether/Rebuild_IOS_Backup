import { useNavigation, useRoute } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View } from "react-native";
import { Image } from "react-native";
import CategoryCard from "../../components/CategoryCard";
import axios from "axios";
import { AppContext } from "../../contexts/AppContext";

import icon_praia from "../../components/TypeIcon/utils/imgs/icone_praia.png";
import icon_aventura from "../../components/TypeIcon/utils/imgs/icone_aventura.png";
import icon_urbano from "../../components/TypeIcon/utils/imgs/icone_urbano.png";
import icon_exotico from "../../components/TypeIcon/utils/imgs/icone_exotico.png";
import icon_neve from "../../components/TypeIcon/utils/imgs/icone_neve.png";
import icon_resort from "../../components/TypeIcon/utils/imgs/icone_resort.png";
import icon_parque from "../../components/TypeIcon/utils/imgs/icone_parque.png";
import icon_viagem from "../../components/TypeIcon/utils/imgs/icone_viagem.png";
import { styles } from "./styles";
import { ICON_TYPES } from "../../components/TypeIcon/utils/iconTypes";
import Header from "../../components/Header";
import { useRef } from "react";
import ScrollToTop from "../../components/ScrollToTop";

export default function Category() {
  const { setLoading } = useContext(AppContext);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [search, setSearch] = useState(false);
  const route = useRoute();
  const route_data = route.params;
  const scrollViewRef = useRef(null);
  const [scroll, setScroll] = useState(0);

  const handleSelected = (
    id_local,
    id_category,
    name,
    local_name,
    local_imagen
  ) => {
    let route_data = {
      name: name,
      id_local: id_local,
      id_category: id_category,
      local_name: local_name,
      local_imagen: local_imagen,
    };
    navigation.navigate("trips", route_data);
  };

  useEffect(() => {
    setSearch(route_data.search);
    setTitle(route_data.name);
    setIcon(
      route_data.name === "praia"
        ? icon_praia
        : route_data.name === "neve"
          ? icon_neve
          : route_data.name === "urbano"
            ? icon_urbano
            : route_data.name === "exótico"
              ? icon_exotico
              : route_data.name === "resort"
                ? icon_resort
                : route_data.name === "parque"
                  ? icon_parque
                  : route_data.name === "aventura"
                    ? icon_aventura
                    : route_data.name === "viagem virtual"
                      ? icon_viagem
                      : null
    );
    const getLocal = async (id) => {
      const optionsCategory = {
        method: "GET",
        url: `https://www.kids2gether.com.br/wp-json/wp/v2/local?filter[meta_key]=tipo&filter[meta_value]=${id}+&_embed=1&per_page=100`,
      };

      try {
        setLoading(true);
        //Getting the locals
        const locals = await axios.request(optionsCategory);
        setData(locals.data);
      } catch (error) {
        console.error(error);
      }
    };
    getLocal(route_data.id_category);
    setColor(
      ICON_TYPES.filter((item) => item.name === route_data.name)[0].color
    );
  }, [route_data]);

  return (
    <>
      {data.length > 0 && (
        <ScrollView
          style={styles.view_container}
          ref={scrollViewRef}
          onScroll={(event) => setScroll(event.nativeEvent.contentOffset.y)}
        >
          <Header
            iconColor={"#333"}
            icon={true}
            title={title.toUpperCase()}
            color={color}
            onBack={() => navigation.navigate("categories")}
          />
          <View style={styles.align_title_icon}>
            <Image
              source={icon}
              style={[styles.title_icon, { tintColor: color }]}
            />
          </View>
          <View style={styles.card_list}>
            {data.map((item, index) => (
              <CategoryCard
                color={color}
                verticalMargin={10}
                onPress={() =>
                  handleSelected(
                    item.id,
                    route_data.id_category,
                    route_data.name,
                    item.name,
                    `${item.acf.imagem}`
                  )
                }
                backgroundImage={{
                  uri: `${item.acf.imagem}`,
                }}
                key={index}
                title={item.name}
              />
            ))}
          </View>
        </ScrollView>
      )}
      <ScrollToTop reference={scrollViewRef} controller={scroll} />
    </>
  );
}
