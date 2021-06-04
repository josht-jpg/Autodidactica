import styles from "./Title.module.scss";

const Title = ({ titleState, timelineUnit, number }) => {
  const [title, setTitle] = titleState;

  const inputLabel = `Give ${timelineUnit} ${number} a Title (optional)`;

  return (
    <div className={styles.container}>
      <h3 className={styles.inputPrompt}>
        {`${timelineUnit} ${number}`}
        <strong
          style={{
            opacity: title.length === 0 && "0.5",
          }}
        >
          :
        </strong>
      </h3>

      <span style={{ display: "inline-block" }}>
        <label className={styles.inputLabel}>{inputLabel}</label>
        <input
          className={styles.input}
          type="text"
          name="timeline-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </span>
    </div>
  );
};

export default Title;
