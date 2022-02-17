import { useRef, useState } from "react";
import useOutsideAlerter from "../../../customHooks/useOutsideAlerter";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import styles from "./ShareOptions.module.scss";
import { BsLink45Deg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { makePrivate, makePublic } from "../../../actions/transcriptActions";

const ShareOptions = ({ handleOptionsClose, transcriptState }) => {
  const ref = useRef(null);
  useOutsideAlerter(ref, handleOptionsClose);

  const [isPublic, setIsPublic] = useState(transcriptState.isPublic);

  const dispatch = useDispatch();

  const handleToggle = () => {
    if (transcriptState.isPublic) {
      dispatch(makePrivate());
    } else {
      dispatch(makePublic());
    }

    transcriptState.isPublic = !transcriptState.isPublic;
    transcriptState.toggle();
    setIsPublic(transcriptState.isPublic);
  };

  const transcriptLink = () =>
    `https://autodidactica.app/public/${transcriptState._id}`;

  const copyLink = () => {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard.writeText(transcriptLink());
        handleOptionsClose();
      }
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.shareOptions} ref={ref}>
        <h3 style={{ fontSize: "0.9rem" }}>{"Make transcript public"}</h3>
        <span style={{ marginLeft: "10px" }}>
          {" "}
          <Toggle
            style={{ marginTop: "10px" }}
            defaultChecked={transcriptState.isPublic}
            onClick={handleToggle}
          />{" "}
        </span>
        <hr style={{ width: "240", marginTop: "20px", marginBottom: "0px" }} />
        <h3
          style={{
            fontSize: "0.95rem",
            marginTop: "16px",
            opacity: !isPublic && "0.5",
            cursor: !isPublic && "default",
            color: !isPublic && "black",
          }}
          className={styles.clickable}
          onClick={copyLink}
        >
          {" "}
          <BsLink45Deg style={{ fontSize: "1.4rem" }} /> Copy Link
        </h3>
      </div>
    </div>
  );
};

export default ShareOptions;
