import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import useOutsideAlerter from "../../../customHooks/useOutsideAlerter";
import styles from "./DeleteAccountPrompt.module.scss";
import buttonStyle from "../../button/Button.module.scss";
import { deleteUser } from "../../../actions/userActions";

const DeleteAccountPrompt = ({ handleClose }) => {
  const ref = useRef(null);
  useOutsideAlerter(ref, handleClose);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = () => {
    dispatch(deleteUser());
    history.push("/");
    window.location.reload();
  };

  return (
    <div
      className={styles.background}
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      <div ref={ref} className={styles.container}>
        <h3 style={{ textAlign: "center" }}>
          Are you sure you want to permenently delete your account?
        </h3>
        <button
          className={buttonStyle.container}
          style={{
            color: "rgb(235, 87, 87)",
            boxShadow: "rgb(235, 87, 87) 0 0 4px",
          }}
          onClick={handleDelete}
        >
          <div
            className={buttonStyle.messageContainer}
            style={{ paddingRight: "0" }}
          >
            <p className={buttonStyle.message}>Yes, Delete my Account</p>
          </div>
        </button>

        <button className={buttonStyle.container} onClick={handleClose}>
          <div
            className={buttonStyle.messageContainer}
            style={{ paddingRight: "0" }}
          >
            <p className={buttonStyle.message}>Cancel</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountPrompt;
