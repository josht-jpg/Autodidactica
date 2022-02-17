import Button from "../../../button/Button";
import styles from "./MainPanel.module.scss";

const MainPanel = ({ setIsRegisterSelected }) => {
  return (
    <div className={styles.mainPanel}>
      <div className={styles.flexContainer}>
        <h2 className={styles.header}>Take Back Control of your Education.</h2>
        <div style={{ marginLeft: "6%", marginRight: "6%" }}>
          <h3 className={styles.prompts}>
            Congratulations, you have been invited to try the beta of
            Autodidactica!
            <br />
            <br />
            Learn something new.
            <br />
            Build your own curriculum. <br /> Share your progress.
          </h3>

          <Button type="Sign Up" action={() => setIsRegisterSelected(true)} />
        </div>
        <img
          className={styles.preview}
          src="https://primer-beta.s3.us-east-2.amazonaws.com/60aeda01da5f97e1f0a3e165"
        />
      </div>
    </div>
  );
};

export default MainPanel;
