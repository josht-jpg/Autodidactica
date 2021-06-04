import styles from "./auth.module.scss";
import buttonStyles from "../../button/Button.module.scss";
import Loader from "react-loader-spinner";
import { useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdMailOutline } from "react-icons/md";
import useOutsideAlerter from "../../../customHooks/useOutsideAlerter";
import { MAIN_BLUE } from "../../../constants/styleConstants";

const AuthScreen = ({ type, eventHandlers, windowDimensions, loading }) => {
  const ref = useRef();
  useOutsideAlerter(ref, eventHandlers.handleClose);

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
          <form className={styles.container} action="/auth/google">
            <h1 className={styles.logo}>
              <i>Autodidactica.</i>
            </h1>
            <h3 style={{ marginTop: "0.3rem", textAlign: "center" }}>
              Take back control of your education.
            </h3>

            <hr style={{ width: "75%" }} />

            <button className={buttonStyles.container}>
              <span className={buttonStyles.iconContainer}>
                <FcGoogle style={{ fontSize: "1.5rem" }} />
              </span>

              <div className={buttonStyles.messageContainer}>
                <p className={buttonStyles.message}>
                  {type === "REGISTER"
                    ? "Join with Google"
                    : type === "SIGN_IN" && "Google Sign In"}
                </p>
              </div>
            </button>

            <button
              className={buttonStyles.container}
              onClick={eventHandlers.emailClick}
            >
              <span className={buttonStyles.iconContainer}>
                <MdMailOutline
                  style={{ fontSize: "1.4rem", marginLeft: "2px" }}
                />
              </span>

              <div className={buttonStyles.messageContainer}>
                <p className={buttonStyles.message}>
                  {type === "REGISTER"
                    ? "Join with Email"
                    : type === "SIGN_IN" && "Email Sign In"}
                </p>
              </div>
            </button>

            <div className={styles.redirect}>
              {type === "REGISTER" ? (
                <>
                  {" "}
                  Have an account? Login{" "}
                  <i
                    style={{
                      fontStyle: "normal",
                      color: MAIN_BLUE,
                      cursor: "pointer",
                    }}
                    onClick={eventHandlers.switchFormType}
                  >
                    Sign in
                  </i>
                </>
              ) : (
                type === "SIGN_IN" && (
                  <>
                    New to Autodidactica?{" "}
                    <i
                      style={{
                        fontStyle: "normal",
                        color: MAIN_BLUE,
                        cursor: "pointer",
                      }}
                      onClick={eventHandlers.switchFormType}
                    >
                      Sign up
                    </i>
                  </>
                )
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
