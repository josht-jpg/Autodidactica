import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../../actions/messageActions";
import useOutsideAlerter from "../../../customHooks/useOutsideAlerter";
import Button from "../../button/Button";
import styles from "./MessagePrompt.module.scss";

const MessagePrompt = ({ messageType, handleClose }) => {
  const ref = useRef(null);
  useOutsideAlerter(ref, handleClose);

  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const submit = async () => {
    await dispatch(sendMessage(message, messageType));
    handleClose();
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
        <h3 className={styles.header}>
          {messageType === "chat"
            ? "We'd love to here about what you're learning!"
            : messageType === "improvement" &&
              "Thank you for suggeting improvements!"}
        </h3>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button type="Submit" action={submit} />
      </div>
    </div>
  );
};

export default MessagePrompt;
