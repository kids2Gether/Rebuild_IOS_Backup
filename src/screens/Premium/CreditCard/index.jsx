import { useContext, useState } from "react";
import { styles } from "./styles";
import cardImg from "../../../../assets/card2.png";
import { UserContext } from "../../../contexts/UserContext";
import { AppContext } from "../../../contexts/AppContext";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import {
  CardField,
  createPaymentMethod,
} from "@stripe/stripe-react-native";
import { Keyboard } from "react-native";
import { addCard, pagar } from "../util/paymentFunction";
import { useSelector } from "react-redux";

export default function CreditCard() {
  const [myCard, setMyCard] = useState({});
  const { paymentInfo, setPaymentInfo, setPaymentConfirmController } =
    useContext(UserContext);
  const {
    setCardController,
    setKErrorController,
    setKError,
    setLoaderController,
  } = useContext(AppContext);
  const user = useSelector((state) => state.user);

  return (
    <View style={styles.title_container}>
      <Text style={styles.text_title}>PREENCHA O SEU CARTÃO</Text>

      <View style={{ width: "100%" }}>
        <Image
          source={cardImg}
          resizeMode="contain"
          style={{ width: "100%", height: 175 }}
        />
        <CardField
          postalCodeEnabled={false}
          onCardChange={(cardDetails) => {
            setMyCard(cardDetails);
          }}
          style={styles.field}
        />
        <View style={styles.button_container}>
          <TouchableOpacity
            onPress={async () => {
              Keyboard.dismiss();
              if (myCard.complete) {
                try {
                  setCardController(false);
                  setLoaderController(true);
                  let token_user = user.user.token;
                  let id_user = user.user.user_id;
                  let card_token = await createPaymentMethod({
                    ...myCard,
                    paymentMethodType: "Card",
                  });
                  let response = await addCard(
                    card_token.paymentMethod,
                    token_user,
                    id_user
                  );
                  let response2 = await pagar(paymentInfo, token_user, id_user);

                  setLoaderController(false);
                  setPaymentConfirmController(true);
                } catch (error) {
                  console.log(error);
                  setLoaderController(false);
                  setKError(
                    "Ops! Houve um problema ao processar o seu cartão, você não será cobrado."
                  );
                  setKErrorController(true);
                }
              } else {
                Alert.alert(
                  "",
                  "Por favor, insira todos os dados do seu cartão corretamente."
                );
              }
            }}
            activeOpacity={0.4}
          >
            <Text style={styles.button}>CONFIRMAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCardController(false)}
            activeOpacity={0.4}
          >
            <Text style={styles.button}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
