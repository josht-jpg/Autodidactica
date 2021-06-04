import styles from "./Header.module.scss";

const Header = ({ setIsLoginSelected, setIsRegisterSelected }) => {
  return (
    <div className={styles.header}>
      <div style={{ margin: "auto" }}>
        <h1 className={styles.logo}>
          <i>Autodidactica</i> <i className={styles.beta}>Beta!</i>
        </h1>
      </div>
      <div className={styles.optionsContainer}>
        <div>
          <h3
            className={styles.headerItem}
            onClick={() => setIsLoginSelected(true)}
          >
            Sign In
          </h3>
        </div>

        <div>
          <h3
            className={styles.headerItem}
            onClick={() => setIsRegisterSelected(true)}
          >
            Sign Up
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Header;
