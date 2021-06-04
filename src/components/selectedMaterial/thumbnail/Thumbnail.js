import styles from "./Thumbnail.module.scss";

const Thumbnail = ({ imageSrc }) => {
  return (
    <img className={styles.thumbnail} src={imageSrc} alt="Project Image" />
  );
};
export default Thumbnail;
