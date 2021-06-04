import React from "react";
import styles from "../header/Header.module.scss";

const PublicHeader = ({ width, displayHeader }) => {
  return (
    <div
      className={styles.header}
      style={{
        width,
        height: !displayHeader && "0",
      }}
    >
      <div style={{ margin: "auto" }}>
        <h1
          className={styles.logo}
          style={{
            opacity: !displayHeader && "0",
          }}
        >
          <i>Autodidactica.</i>
        </h1>
      </div>
    </div>
  );
};

export default PublicHeader;
