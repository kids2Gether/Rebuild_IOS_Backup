import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import Tips from "../../screens/Tips";
import Tip from "../../screens/Tip";
import News from "../../screens/News";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function StackTipsRoutes({ navigation, route }) {
  const [user, setUser] = useState(true);

  // to hide tab bar on specific stack screens
  useLayoutEffect(() => {
    const tabHiddenRoutes = ["selected-tip", "news"];

    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tips" component={Tips} options={screenAnimation} />
      <Stack.Screen
        name="selected-tip"
        component={Tip}
        options={screenAnimation}
      />
      <Stack.Screen name="news" component={News} options={screenAnimation} />
    </Stack.Navigator>
  );
}

const screenAnimation = {
  animation: "slide_from_left",
  animationDuration: "10",
};
