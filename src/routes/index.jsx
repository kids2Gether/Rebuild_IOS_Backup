import { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabRoutes from "./tab.routes";
import { AppContext } from "../contexts/AppContext";
import Modal from "../components/Modal";
import OffCanvas from "../components/OffCanvas";
import {
  InsertPin,
  EditPin,
} from "../screens/Map/components/InsertPin/index.jsx";
import Loader from "../components/Loader";
import InitialModal from "../components/InitialModal";
import { UserContext } from "../contexts/UserContext";
import ErrorModal from "../components/ErrorModal";
import { useSelector } from "react-redux";

export default function Routes() {
  const {
    mapController,
    pinController,
    offersController,
    loaderController,
    recoveryErrorController,
    recoveryOkController,
    firstTimeController,
    setFirstTimeController,
    pinData,
    offCanvasVariant,
    kErrorController,
    cardController,
    cardConfirmController,
    mapFilterController,
    popUpController,
    handleShowMembershipPopUp
  } = useContext(AppContext);
  const {
    deleteAccountController,
    cancelSubcriptionController,
    paymentConfirmController,
  } = useContext(UserContext);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const testFirst = async () => {
      let first = await AsyncStorage.getItem("TOUR_OPENED");
      if (first) {
        setFirstTimeController(false);
        handleShowMembershipPopUp(user);
      }
    };
    testFirst();
  }, []);

  return (
    <>
      <TabRoutes />
      {mapController && <Modal variant={"map"} />}
      {mapFilterController && <Modal variant={"map-filter"} />}
      {offersController && <Modal variant={"offers"} />}
      {pinController && <Modal variant={""} />}
      {recoveryErrorController && <Modal variant={"recovery_error"} />}
      {recoveryOkController && <Modal variant={"recovery_ok"} />}
      {firstTimeController && <InitialModal />}
      {loaderController && <Loader />}
      <OffCanvas
        variant={'map'}
        children={
          offCanvasVariant === "create-pin" ? (
            <InsertPin location={pinData} />
          ) : (
            <EditPin data={pinData} />
          )
        }
      />
      {popUpController && <OffCanvas variant={'popup'}/>}
      {deleteAccountController && <Modal variant={"delete_account"} />}
      {cancelSubcriptionController && <Modal variant={"cancel_subcription"} />}
      {cardController && <Modal variant={"credit_card"} />}
      {cardConfirmController && <Modal variant={"confirm_card"} />}
      {paymentConfirmController && <Modal variant={"payment_confirm"} />}
      {kErrorController && <ErrorModal />}
    </>
  );
}
