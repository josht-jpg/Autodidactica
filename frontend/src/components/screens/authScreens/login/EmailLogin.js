import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { login } from "../../../../actions/userActions";
import styles from "./EmailLogin.module.scss";
import useOutsideAlerter from "../../../../customHooks/useOutsideAlerter";
import Button from "../../../button/Button";
import Loader from "react-loader-spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const EmailLogin = ({ handleClose, switchFormType, windowDimensions }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, loading, error } = userLogin;

  const ref = useRef(null);
  useOutsideAlerter(ref, handleClose);

  useEffect(() => {
    if (userInfo) {
      if (localStorage.getItem("subject")) {
        history.push("/dashboard/days");
        window.location.reload();
      } else {
        history.push("/subject");
      }
    }
  }, [history, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(login(email, password));
  };

  return (
    <div
      className={styles.background}
      style={{
        width: windowDimensions.windowWidth,
        height: windowDimensions.windowHeight,
      }}
    >
      <div ref={ref} className={styles.loginScreen}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader
              type="Oval"
              color="#1a1aff"
              height={38}
              width={38}
              timeout={15000}
            />
          </div>
        ) : (
          <form
            onSubmit={submitHandler}
            className={styles.container}
            noValidate
          >
            <h1 className={styles.logo}>
              <i>Autodidactica.</i>
            </h1>
            <h3 style={{ marginTop: "0.3rem", textAlign: "center" }}>
              Take back control of your education.
            </h3>

            <hr style={{ width: "75%" }} />

            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                placeholder="Email"
                type="text"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <ErrorMessage error={error} />}

            <Button type="Continue" />

            <div className={styles.redirect}>
              New to Autodidactica?{" "}
              <a tyle={{ cursor: "pointer" }} onClick={switchFormType}>
                Sign up
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailLogin;
