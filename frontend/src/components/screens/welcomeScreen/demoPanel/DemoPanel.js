import ReactPlayer from "react-player";
import styles from "./DemoPanel.module.scss";

const sampleTranscripts = [
  {
    header: "Web Development",
    url: "https://autodidactica.app/public/60b7ec4fd132ee00155655b2",
    imageSrc:
      "https://primer-beta.s3.us-east-2.amazonaws.com/60b92e1bea496200150ec827",
    transform: "perspective(500px) rotateY(4deg) rotateX(0.75deg)",
  },
  {
    header: "Data Science",
    url: "https://autodidactica.app/public/60b7e1bed24b580015ea969e",
    imageSrc:
      "https://primer-beta.s3.us-east-2.amazonaws.com/60b92550ea496200150ec743",
    transform: "perspective(500px) rotateX(0.75deg)",
  },
  {
    header: "Graphic Design",
    url: "https://autodidactica.app/public/60b7f07a9e223a001526986d",
    imageSrc:
      "https://primer-beta.s3.us-east-2.amazonaws.com/60b92da3ea496200150ec825",
    transform: "perspective(500px) rotateY(-4deg) rotateX(0.75deg)",
  },
];

const DemoPanel = () => {
  return (
    <div className={styles.container}>
      <h3 style={{ color: "white", marginTop: "4rem" }}>
        View sample transcripts
      </h3>
      <div style={{ display: "flex" }}>
        {sampleTranscripts.map((sampleTranscript) => (
          <a
            className={styles.link}
            href={sampleTranscript.url}
            target="_blank"
            rel="noreferrer"
          >
            <h3 className={styles.transcriptHeader}>
              {" "}
              {sampleTranscript.header}{" "}
            </h3>
            <img
              style={{
                transform: sampleTranscript.transform,
              }}
              className={styles.demo}
              src={sampleTranscript.imageSrc}
            />
          </a>
        ))}
      </div>
      <h3 style={{ marginTop: "10rem", color: "white" }}>Watch a demo</h3>
      <ReactPlayer
        style={{ margin: "auto", maxWidth: "85%" }}
        url="https://www.youtube.com/watch?v=IQ2gBCIoFoU"
        controls={true}
      />
    </div>
  );
};

export default DemoPanel;
