import React, { useContext, useEffect } from "react";
import { Alert, View } from "react-native";
import { styles } from "./styles";
import { Text } from "react-native";
import News from "./components/news";
import Categories from "./components/categories";
import Tips from "./components/tips";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNews } from "../../reducer/newsReducer";
import { setTips } from "../../reducer/tipsReducer";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import { AppContext } from "../../contexts/AppContext";

export default function Home({ onLayout }) {
  const news = useSelector((state) => state.news);
  const tips = useSelector((state) => state.tips);
  const dispatch = useDispatch();
  const { setLoading, setAwaitLoading } = useContext(AppContext);

  useEffect(() => {
    const getData = async () => {
      const optionsNews = {
        method: "GET",
        url: "https://www.kids2gether.com.br/wp-json/wp/v2/posts",
        params: { per_page: "5", _embed: "1" },
      };
      const optionsTips = {
        method: "GET",
        url: "https://www.kids2gether.com.br/wp-json/wp/v2/posts?categories=118&per_page=100",
      };
      try {
        //Getting the news
        const news = await axios.request(optionsNews);
        dispatch(setNews(news.data));
        //Getting the tips
        const tips = await axios.request(optionsTips);
        dispatch(setTips(tips.data));
        setTimeout(() => {
          setLoading(false);
          setAwaitLoading(false);
        }, 1000);
      } catch (error) {
        Alert.alert(
          "",
          "Houve um problema ao buscar conteúdo. Tente novamente mais tarde"
        );
      }
    };
    getData();
  }, []);

  useEffect(() => {
    // first loading screen shows only if there is no data
    if (news.news.length === 0 && tips.tips.length === 0) {
      setLoading(true);
      setAwaitLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
        setAwaitLoading(false);
      }, 1000);
    }
  }, [news, tips]);

  return (
    <>
      <Animated.ScrollView
        exiting={SlideInLeft}
        entering={SlideInRight}
        onLayout={onLayout}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.app_logo}>Kids2Gether</Text>
        <View style={{ marginTop: 30 }}>
          <News data={news.news} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Categories />
        </View>
        <View style={{ marginTop: 20 }}>
          <Tips data={tips.tips.slice(0, 8)} />
        </View>
      </Animated.ScrollView>
    </>
  );
}
