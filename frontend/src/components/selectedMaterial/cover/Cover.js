import styles from "./Cover.module.scss";

const Cover = ({ imageSrc }) => {
  return <img className={styles.cover} alt="Book Cover" src={imageSrc} />;
};

export default Cover;
