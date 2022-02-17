import styles from "./Books.module.scss";

const Books = ({ books }) => {
  return books.map(
    (book) =>
      book && (
        <div
          key={`book-display-${book._id}`}
          style={{ margin: "17px auto 17px auto" }}
        >
          <div className={styles.container}>
            <p className={styles.title}>{book.title}</p>
            <img
              src={book.imageSrc}
              alt={book.title}
              className={styles.cover}
            />
          </div>
        </div>
      )
  );
};

export default Books;
