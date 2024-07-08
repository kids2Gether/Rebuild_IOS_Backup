import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "./src/store";

import { NavigationContainer } from "@react-navigation/native";

import LoadingScreen from "./src/components/LoadingScreen";
import AppProvider from "./src/contexts/AppContext";
import FontsProvider from "./src/contexts/FontsContext";
import Routes from "./src/routes";
import UserProvider from "./src/contexts/UserContext";
import { AppEventsLogger } from "react-native-fbsdk-next";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  return (
    <Provider store={store}>
      <UserProvider>
        <AppProvider>
          <StripeProvider publishableKey="pk_live_C7omT6lZBjdduNCeR9ncdVM800qMLRASa4" merchantIdentifier="merchant.com.kids2gether" >
          <NavigationContainer>
            <FontsProvider>
              <StatusBar backgroundColor="#111" style={"light"} />
              <Routes />
              <LoadingScreen />
            </FontsProvider>
          </NavigationContainer>
          </StripeProvider>
        </AppProvider>
      </UserProvider>
    </Provider>
  );
}
