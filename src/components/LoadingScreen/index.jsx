import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import app_logo from '../../../assets/logo/logo-white.png'
import { AppContext } from '../../contexts/AppContext'
import AirplaneAnimation from '../../../assets/animations/airplane'
import Animated, { BounceIn, FadeOut } from 'react-native-reanimated'

export default function LoadingScreen() {
  const { loading, setLoading, awaitLoading } = useContext(AppContext);

  const endAnimation = () => {
    setLoading(false);
  }

  return (
    <>
      {loading &&
        <Animated.View
          style={[styles.loading_container]}
          exiting={FadeOut}
        >
          <AirplaneAnimation onAnimationFinish={awaitLoading ? null : () => endAnimation()} />
          <Animated.Image
            entering={BounceIn.delay(500)}
            fadeDuration={200}
            exiting={FadeOut}
            source={app_logo}
            style={styles.app_logo}
          />
        </Animated.View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    width: "100%",
    height: "100%",
  },
  app_logo: {
    width: 160,
    height: 160,
    objectFit: "contain",
  },
});