import styles from "./Button.module.scss";

const Button = ({ type, action }) => {
  return (
    <button
      className={styles.container}
      style={{ backgroundColor: "white" }}
      onClick={() => action && action()}
    >
      <div className={styles.messageContainer} style={{ paddingRight: "0" }}>
        <p className={styles.message}>{type}</p>
      </div>
    </button>
  );
};

export default Button;
