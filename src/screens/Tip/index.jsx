import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/core";
import { styles } from "./styles";
import { ImageBackground } from "react-native";
import Header from "../../components/Header";
import ScrollToTop from "../../components/ScrollToTop";
import { useRef } from "react";
import HTML from "react-native-render-html";

// let parser = new DOMParser();
// let doc = parser.parseFromString(API_DATA, 'text/html');
// let imgs = doc.querySelectorAll('img');

// imgs.forEach(img => {
//   let figure = doc.createElement('figure');
//   figure.className = 'wp-block-image';
//   img.parentNode.replaceChild(figure, img);
//   figure.appendChild(img);
// });

// let serializer = new XMLSerializer();
// let newHtmlAPIRes = serializer.serializeToString(doc);

// const RenderHTML = ({ children, className = '' }) => (
//   <div
//     className={className}
//     dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />') }}
//   />
// )

export default function Tip() {
  const navigation = useNavigation();
  const tips = useSelector((state) => state.tips);
  const [data, setData] = useState(null);
  const route = useRoute();
  const route_data = route.params;
  const scrollViewRef = useRef(null);
  const [scroll, setScroll] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const mydata = tips.tips.filter((item) => item.id === route_data.id);
    setData(mydata[0]);
  }, [route_data]);

  useEffect(() => {
    if (data) {
      let filtered_data = data.content.rendered
      console.log(filtered_data);
    }
  }, [data])
  return (
    <>
      <ScrollView style={styles.view_container} ref={scrollViewRef} onScroll={(event) => setScroll(event.nativeEvent.contentOffset.y)}>
        {data &&
          <>
            <View>
              <View style={styles.background_overlay}></View>
              <View style={styles.header_content}>
                <Header
                  icon={true}
                  title={"DICAS"}
                  color={"#fff"}
                  onBack={() => navigation.navigate("tips")}
                />
              </View>
              <ImageBackground
                source={{ uri: data.yoast_head_json.og_image[0].url }}
                style={styles.image}
              ></ImageBackground>
              <View style={styles.align_content}>
                <Text style={styles.title}>{data.title.rendered}</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 10, marginBottom: 100 }}>
              <HTML 
                // source={{ html: data.content.rendered.replace(/<p><img([^>]*)><\/p>/g, '<figure class="wp-block-image is-resized"><img$1></figure>')}}
                source={{ html: data.content.rendered }}
                contentWidth={width - 20}
              />
              {/* <RenderHTML children={newHtmlAPIRes} /> */}
            </View>
            <View></View>
          </>
        }
      </ScrollView>
      <ScrollToTop reference={scrollViewRef} controller={scroll} />
    </>
  );
}
