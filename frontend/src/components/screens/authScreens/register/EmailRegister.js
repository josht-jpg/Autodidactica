import React, { useState, useEffect, useRef } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { register } from "../../../../actions/userActions";
import useOutsideAlerter from "../../../../customHooks/useOutsideAlerter";
import Button from "../../../button/Button";
import authStyles from "../auth.module.scss";
import ErrorMessage from "../errorMessage/ErrorMessage";
import styles from "./EmailRegister.module.scss";

const EmailRegister = ({ handleClose, switchFormType, windowDimensions }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userRegister = useSelector((state) => state.userRegister);
  const { isValid, loading } = userRegister;
  const [error, setError] = useState(userRegister.error);

  const history = useHistory();

  useEffect(() => {
    if (isValid) {
      history.push("/subject");
    } else {
      setError(userRegister.error);
    }
  }, [userRegister]);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a password");
    } else if (!email) {
      setError("Please enter an email address");
    } else if (password.length < 6) {
      setError(
        "Please enter a password that is at least 6 digits long. Bonus points if it's 12 digits of longer"
      );
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  const ref = useRef(null);
  useOutsideAlerter(ref, handleClose);

  return (
    <div
      className={styles.background}
      style={{
        width: windowDimensions.windowWidth,
        height: windowDimensions.windowHeight,
      }}
    >
      <div ref={ref} className={styles.authScreen}>
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
            className={authStyles.container}
            noValidate
          >
            <h1 className={authStyles.logo}>
              <i>Autodidactica.</i>
            </h1>
            <h3 style={{ marginTop: "0.3rem", textAlign: "center" }}>
              Take back control of your education.
            </h3>

            <hr style={{ width: "75%" }} />

            <div className={authStyles.inputContainer}>
              <input
                className={authStyles.input}
                placeholder="Email"
                type="text"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={authStyles.inputContainer}>
              <input
                className={authStyles.input}
                placeholder="Name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={authStyles.inputContainer}>
              <input
                className={authStyles.input}
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={authStyles.inputContainer}>
              <input
                className={authStyles.input}
                placeholder="Confirm Password"
                type="password"
                name="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <ErrorMessage error={error} />}

            <Button type="Get Started" />
            <div className={authStyles.redirect}>
              Have an account? Login{" "}
              <a style={{ cursor: "pointer" }} onClick={switchFormType}>
                Sign in
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailRegister;
