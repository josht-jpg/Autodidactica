import ReactLoader from "react-loader-spinner";

const Loader = ({ style }) => (
  <ReactLoader
    type="Oval"
    color="#0062e3"
    height={50}
    width={50}
    style={style}
    timeout={10000}
  />
);

export default Loader;
