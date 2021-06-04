import React, { useEffect, useState } from "react";
import Header from "./header/Header";
import Login from "../authScreens/login/Login";
import Register from "../authScreens/register/Register";
import MainPanel from "./mainPanel/MainPanel";
import AboutPanel from "./aboutPanel/AboutPanel";
import DemoPanel from "./demoPanel/DemoPanel";
import styles from "./WelcomeScreen.module.scss";

const WelcomeScreen = () => {
  const [isLoginSelected, setIsLoginSelected] = useState(false);
  const handleLoginClose = () => setIsLoginSelected(false);

  const [isRegisterSelected, setIsRegisterSelected] = useState(false);
  const handleRegisterClose = () => setIsRegisterSelected(false);

  const switchFormType = () => {
    setIsLoginSelected((prev) => !prev);
    setIsRegisterSelected((prev) => !prev);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      {isLoginSelected && (
        <Login
          handleClose={handleLoginClose}
          windowDimensions={{ windowHeight, windowWidth }}
          switchFormType={switchFormType}
        />
      )}
      {isRegisterSelected && (
        <Register
          handleClose={handleRegisterClose}
          windowDimensions={{ windowHeight, windowWidth }}
          switchFormType={switchFormType}
        />
      )}

      <Header
        setIsLoginSelected={setIsLoginSelected}
        setIsRegisterSelected={setIsRegisterSelected}
      />

      <div className={styles.panelsContainer}>
        <MainPanel setIsRegisterSelected={setIsRegisterSelected} />
        <div className={styles.flexContainer}>
          <AboutPanel />
          <DemoPanel />

          <p style={{ fontSize: "1.1rem" }}>
            If you have any questions, or just want to chat about what subject
            you plan to learn, please send me a message at
            joshtaylor361@gmail.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
