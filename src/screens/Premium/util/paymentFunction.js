import axios from "axios";

export const pagar = async (paymentInfo, token_user, id_user) => {
  try {
    const options = {
      method: "POST",
      url: `https://us-central1-kids2gether-4ca94.cloudfunctions.net/subscriptions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token_user}`,
        Accept: "application/json",
      },
      data: { user: id_user, plan: paymentInfo },
    };
    let payment_info = await axios.request(options);
    return payment_info;
  } catch (error) {
    throw error;
  }
};

export const addCard = async (card_token, token_user, id_user) => {
  try {
    const options = {
      method: "POST",
      url: `https://us-central1-kids2gether-4ca94.cloudfunctions.net/payment/source`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token_user}`,
        Accept: "application/json",
      },
      data: { user: id_user, token: card_token, replace: "true" },
    };
    let user_source = await axios.request(options);
    return user_source;
  } catch (error) {
    throw error;
  }
};
