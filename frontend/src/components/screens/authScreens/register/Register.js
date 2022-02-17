import { useState } from "react";
import AuthScreen from "../AuthScreen";
import EmailRegister from "./EmailRegister";

const Register = ({ handleClose, switchFormType, windowDimensions }) => {
  const [isEmailSelected, setIsEmailSelected] = useState(false);
  const emailClick = () => setIsEmailSelected(true);

  return isEmailSelected ? (
    <EmailRegister
      handleClose={handleClose}
      switchFormType={switchFormType}
      windowDimensions={windowDimensions}
    />
  ) : (
    <AuthScreen
      type="REGISTER"
      eventHandlers={{
        handleClose,
        switchFormType,
        emailClick,
      }}
      windowDimensions={windowDimensions}
    />
  );
};

export default Register;
