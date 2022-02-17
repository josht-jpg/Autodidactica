import { useSelector } from "react-redux";
import AuthScreen from "../AuthScreen";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import EmailLogin from "./EmailLogin";

const Login = ({ handleClose, switchFormType, windowDimensions }) => {
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const googleAuth = useSelector((state) => state.googleAuth);

  useEffect(() => {
    if (userInfo || googleAuth.userInfo) {
      if (localStorage.getItem("subject")) {
        history.push("/dashboard/days");
        window.location.reload();
      } else {
        history.push("/subject");
      }
    }
  }, [history, userInfo, googleAuth]);

  const [isEmailSelected, setIsEmailSelected] = useState(false);
  const emailClick = () => setIsEmailSelected(true);

  return isEmailSelected ? (
    <EmailLogin
      handleClose={handleClose}
      switchFormType={switchFormType}
      windowDimensions={windowDimensions}
    />
  ) : (
    <AuthScreen
      type="SIGN_IN"
      eventHandlers={{
        handleClose,
        switchFormType,
        emailClick,
      }}
      windowDimensions={windowDimensions}
      loading={googleAuth.loading}
    />
  );
};

export default Login;
