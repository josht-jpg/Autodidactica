import { useDispatch } from "react-redux";
import { getUserInfo } from "../actions/userActions";

const useAuthResponse = () => {
  const dispatch = useDispatch();
  if (!localStorage.getItem("userInfo")) {
    const lastSlashIndex = window.location.href.lastIndexOf("/");
    const token = window.location.href.slice(lastSlashIndex + 1);

    if (token) {
      dispatch(getUserInfo(token.slice(0, -1)));
    }
  }
};

export default useAuthResponse;
