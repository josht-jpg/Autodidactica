import React, { useEffect } from "react";
import useAuthResponse from "../../../../customHooks/useAuthResponse";
import NewSubject from "../../../newSubject/NewSubject";

const AddSubjectScreen = () => {
  useAuthResponse();

  useEffect(() => {
    document.body.style = "background: #002147;";

    return () => {
      document.body.style = "background: white;";
    };
  }, []);

  const containerStyles = {
    width: "70vw",
    height: "60vh",
    boxShadow: "#10a1f2 0 0 18px",
    marginTop: "10vh",
    alignItems: "center",
  };

  return <NewSubject containerStyles={containerStyles} />;
};

export default AddSubjectScreen;
