import styles from "./Header.module.scss";

const Header = ({ plan }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{plan}</h1>
    </div>
  );
};

export default Header;
