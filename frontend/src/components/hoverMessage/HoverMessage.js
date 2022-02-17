import styles from "./HoverMessage.module.scss";

const HoverMessage = ({ message }) => {
  return <div className={styles.hoverMessage}>{message}</div>;
};

export default HoverMessage;
