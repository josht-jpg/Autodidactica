import styles from "./TranscriptTitle.module.scss";

const TranscriptTitle = ({ title, userName }) => {
  return (
    <>
      <h1 className={styles.userName}>{userName}</h1>
      <hr style={{ width: `${userName.length * 20}px` }} />
      <h1 className={styles.title}>{title}</h1>
    </>
  );
};

export default TranscriptTitle;
