import styles from "./ResourceCard.module.scss";

const ResourceCard = ({ resource }) => {
  return (
    <>
      <img
        className={styles.cover}
        src={resource.imageSrc}
        alt={resource.title}
      />
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>{resource.title}</h3>
      </div>

      <p className={styles.details}>
        {resource.authors}{" "}
        {resource.publishedDate && " | " + resource.publishedDate.slice(0, 4)}
      </p>
    </>
  );
};

export default ResourceCard;
