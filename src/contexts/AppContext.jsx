import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const AppContext = createContext({});

export default function AppProvider({ children }) {
  // loadercontroller
  const [loading, setLoading] = useState(false);
  const [awaitLoading, setAwaitLoading] = useState(false);
  const [loaderController, setLoaderController] = useState(false);

  // map show pin (filteres)
  const [showContentMarker, setShowContentMarker] = useState(false);
  const [showWantMarker, setShowWantMarker] = useState(true);
  const [showVisitedMarker, setShowVisitedMarker] = useState(true);

  // modal content controllers
  // -- map
  const [mapController, setMapController] = useState(false);
  const [mapFilterController, setMapFilterController] = useState(false);
  const [pinController, setPinController] = useState(false);
  const [pinData, setPinData] = useState(null);

  // -- offers
  const [offersController, setOffersController] = useState(false);

  const [recoveryErrorController, setRecoveryErrorController] = useState(false);
  const [recoveryOkController, setRecoveryOKController] = useState(false);
  const [firstTimeController, setFirstTimeController] = useState(true);
  const [kError, setKError] = useState("Ocorreu um error, intente novamente");
  const [kErrorController, setKErrorController] = useState(false);
  const [cardController, setCardController] = useState(false);
  const [cardConfirmController, setCardConfirmController] = useState(false);

  // insert pin off canvas controller
  const [offCanvasController, setOffCanvasController] = useState(false);
  const [offCanvasVariant, setOffCanvasVariant] = useState('create-pin');

  // pop up de marketing 
  const [popUpController, setPopUpController] = useState(false);

  const onFirstModalClose = (controller) => {
    // for close first access modal
    setFirstTimeController(false);
    // for allow membership pop up context 
    handleShowMembershipPopUp(controller)
  }

  const handleShowMembershipPopUp = (controller) => {
    // for allow membership pop up context // user from reducer to check in if
    if (!controller.user || controller.user && !controller.user.membership) {
      setTimeout(() => { setPopUpController(true) }, 20000)
    }
  }
  
  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        awaitLoading,
        setAwaitLoading,
        setMapController,
        showContentMarker,
        setShowContentMarker,
        showWantMarker,
        setShowWantMarker,
        showVisitedMarker,
        setShowVisitedMarker,
        mapFilterController,
        setMapFilterController,
        setOffersController,
        setPinController,
        mapController,
        pinController,
        pinData,
        setPinData,
        offersController,
        offCanvasController,
        setOffCanvasController,
        offCanvasVariant,
        setOffCanvasVariant,
        loaderController,
        setLoaderController,
        recoveryErrorController,
        setRecoveryErrorController,
        recoveryOkController,
        setRecoveryOKController,
        firstTimeController,
        setFirstTimeController,
        kError,
        setKError,
        kErrorController,
        setKErrorController,
        cardController,
        setCardController,
        cardConfirmController,
        setCardConfirmController,
        popUpController,
        setPopUpController,
        handleShowMembershipPopUp,
        onFirstModalClose
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
