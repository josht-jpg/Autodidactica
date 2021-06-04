import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { FaBook } from "react-icons/fa";
import { addBook } from "../../../../actions/resourceActions";
import BookOption from "../../../select/selectOptions/bookOption/BookOption";
import {
  MultiValueContainer,
  MultiValueRemove,
} from "../../../select/MultiValue";
import generateMongoId from "../../../../utils/generateMongoId";
import styles from "./AddBookScreen.module.scss";
import replaceProtocol from "../../../../utils/replaceProtocol";

const AddBookScreen = ({ handleCloseAddScreen, handleAddBook }) => {
  const [book, setBook] = useState([]);

  const [authors, setAuthors] = useState("");
  const [publishedDate, setPublishedDate] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();

  const displayAuthors = (authorsInput) => {
    Array.isArray(authorsInput)
      ? setAuthors(authorsInput.join(", "))
      : setAuthors("");
  };

  const changeBookHandler = (input) => {
    setBook(input);
    setPublishedDate(input ? input.publishedDate : "");
    displayAuthors(input && input.authors);
  };

  const changeReadingHandler = (searchInput) => {
    async function catchBooks(books, searchInput) {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );
      const json = await res.json();

      json.items &&
        json.items.slice(0, 10).map((book) => {
          book.volumeInfo &&
            books.push({
              value: book.volumeInfo.title,
              label: book.volumeInfo.title,
              title: book.volumeInfo.title,
              imageSrc:
                book.volumeInfo.imageLinks &&
                replaceProtocol(book.volumeInfo.imageLinks.smallThumbnail),
              link: book.volumeInfo.infoLink,
              authors: book.volumeInfo.authors,
              publishedDate: book.volumeInfo.publishedDate,
            });
        });

      setSearchResults(books);
    }

    let books = [];
    if (searchInput) {
      searchInput = searchInput.toLowerCase();
      searchInput.replace(/ /, "+");
      catchBooks(books, searchInput);
    }
  };

  const handleAuthorsChange = (e) => {
    setAuthors(e.target.value);
    book.authors = e.target.value;
  };

  const handleDateChange = (e) => {
    setPublishedDate(e.target.value);
    book.publishedDate = e.target.value;
  };

  const submitHandler = (e) => {
    book._id = generateMongoId();

    if (handleAddBook) {
      e.preventDefault();
      handleAddBook(book);
    }

    dispatch(addBook(book));
    handleCloseAddScreen();
  };

  return (
    <form onSubmit={(e) => submitHandler(e)} className={styles.form} noValidate>
      <h1>
        <FaBook />
      </h1>

      <div
        className={`${styles.inputContainer} new-book-search`}
        style={{ marginBottom: book && book.title && "7rem" }}
      >
        <label className={styles.label}>Title</label>
        <Select
          value={book}
          name="book"
          isMulti
          placeholder=""
          className="basic-multi-select"
          onInputChange={changeReadingHandler}
          options={searchResults}
          getOptionLabel={(option) => <BookOption option={option} />}
          filterOption={(option) => true}
          isOptionDisabled={() => false}
          isSearchable={book && book.length === 0}
          components={{ MultiValueRemove, MultiValueContainer }}
          styles={{
            marginBottom: "1rem",
            boxShadow: "0.5px 0.5px 3px 0.5px #0062e3",
            multiValue: (base) => ({
              ...base,
              backgroundColor: "transparent",
              width: "40vw",
            }),
            multiValueLabel: (base) => ({
              ...base,
              backgroundColor: "transparent",
              marginBottom: "0px",
              paddingBottom: "0px",
              height: "74px",
              display: "block",
              margin: "auto",
            }),
            menu: (styles) => ({
              ...styles,
              width: "40vw",
              color: "black",
              marginBottom: "1rem",
            }),
          }}
          onChange={(input) => input && changeBookHandler(input[0])}
        />
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>Authors</label>
        <input
          className={styles.input}
          type="text"
          name="authors"
          value={authors}
          onChange={(e) => handleAuthorsChange(e)}
          multiple
        />
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.label}>Published Date</label>
        <input
          className={styles.input}
          type="text"
          name="published date"
          value={publishedDate}
          onChange={(e) => handleDateChange(e)}
          multiple
        />
      </div>

      <button className={styles.submit} type="submit">
        Add Book
      </button>
    </form>
  );
};

export default AddBookScreen;
