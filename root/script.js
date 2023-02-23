async function getBook() {
  try {
    const response = await fetch("./data/data.json");

    const booksPageButton = document.querySelector(".option-books");
    const homePageButton = document.querySelector(".option-home");
    const allBooksButton = document.querySelector(".option-all-books");
    const genreButton = document.querySelector(".option-genre");
    const booksPage = document.querySelector("#content-books");
    const homePage = document.querySelector("#content-home");
    const checkbox = document.querySelector(".adult");
    const searchBar = document.querySelector(".input-search-field");

    let data = await response.json();
    let books = data.results;
    let filteredBooks = [];
    let genres = [];
    let underageGenres = [];
    let adultGenres = [
      "adult",
      "lgbt",
      "erotic",
      "glbt",
      "queer",
      "new adult",
      "adult fiction",
      "erotica",
      "erotic romance",
      "bdsm",
      "abuse",
      "alcohol",
      "lesbian",
      "gay",
    ];
    let titles = [];

    books.forEach((book) => {
      let bookGenre = book.genre.split(",");
      bookGenre.forEach((genre) => {
        if (!genres.includes(genre)) {
          genres.push(genre);
        }
      });
    });

    underageGenres = genres
      .filter((allGenre) => {
        return !adultGenres.some((genre) => {
          return allGenre.toLowerCase().includes(genre);
        });
      })
      .sort();

    filteredBooks = books
      .filter((book) => {
        return !adultGenres.some((genre) => {
          return book.genre.toLowerCase().includes(genre);
        });
      })
      .sort();

    books.forEach((book) => {
      let bookTitles = book.title;
      if (!titles.includes(bookTitles)) {
        titles.push(bookTitles);
      }
    });

    // ----- Show Book Info ----- //

    function showBookInfo(book) {
      document.querySelector(".book-info-container").innerHTML = "";
      document.querySelector(".book-info-container").innerHTML += `
                <div class="book-info-card-container">
                <div class="back-button"><img src="./icons/back.png" alt=""></div>
                <div class="book-info-card">
                    <div class="book-info">
                    <div class="book-info-image">
                        <img src="${book.img}">
                    </div>
                    <div class="book-info-text">
                      <div class="book-info-name">
                         <p>${book.title}</p>
                      </div>
                     <div class="book-info-author">
                         <p>Author: ${book.author}</p>
                      </div>
                     <div class="book-info-genre">
                         <p>Genre: ${book.genre}</p>
                      </div>
                     <div class="book-info-score">
                         <p>Rating: ${book.rating}</p>
                     </div>
                    </div>
                    </div>
                    <div class="book-info-description">
                          <p>Description: ${book.desc}</p>
                      </div>
                </div>
            </div>
              `;
    }

    // ----- Search Books ----- //

    function searched() {
      if (searchBar.value) {
        let searchedBooks = books.filter((book) => {
          return book.title
            .toString()
            .toLowerCase()
            .includes(searchBar.value.toLowerCase());
        });

        document.querySelector(".book-container").innerHTML = "";

        if (searchedBooks != []) {
          for (let index = 0; index < searchedBooks.length; index++) {
            tab = `
            <div class="book-card-container">
                <div class="book-card">
                    <div class="book-image">
                        <img src="${searchedBooks[index].img}">
                    </div>
                    <div class="book-name">
                        <p>${searchedBooks[index].title}</p>
                    </div>
                    <div class="book-card-score">
                        <p>Rating: ${searchedBooks[index].rating}</p>
                    </div>
                </div>
            </div>
          `;
            document.querySelector(".book-container").innerHTML += tab;

            document
              .querySelectorAll(".book-card-container")
              .forEach((bookCard, index) => {
                bookCard.addEventListener("click", () => {
                  showBookInfo(searchedBooks[index]);

                  document.querySelector(".all-books").style.display = "none";
                  document.querySelector(".book-info-container").style.display =
                    "flex";
                  document
                    .querySelector(".back-button img")
                    .addEventListener("click", () => {
                      genreButton.classList.remove("active");
                      document.querySelector(".all-books").style.display =
                        "grid";
                      document.querySelector(".genre-books").style.display =
                        "none";
                      document.querySelector(
                        ".book-info-container"
                      ).style.display = "none";
                    });
                });
              });
          }
        }

        searchBar.value = "";
        homePage.style.display = "none";
        booksPage.style.display = "flex";
        booksPageButton.classList.add("active");
        homePageButton.classList.remove("active");
        genreButton.classList.remove("active");
        allBooksButton.classList.add("active");
        document.querySelector(".all-books").style.display = "grid";
        document.querySelector(".genre-books").style.display = "none";
        document.querySelector(".book-info-container").style.display = "none";
      }
    }

    // ----- Most Reviews By Genre ----- //

    let randIndex = Math.floor(Math.random() * underageGenres.length - 1);
    let booksWithGenre = filteredBooks.filter((book) => {
      return book.genre.includes(genres[randIndex]);
    });
    document.querySelector(".most-reviews-by-genre-text").innerHTML +=
      genres[randIndex];
    let mostReviewsByGenre = [...booksWithGenre].sort((a, b) => {
      return a.reviews < b.reviews ? 1 : a.reviews > b.reviews ? -1 : 0;
    });
    let slicedMostReviewsByGenre = mostReviewsByGenre.slice(0, 4);

    function mostReviews() {
      for (let index = 0; index < slicedMostReviewsByGenre.length; index++) {
        tab = `
            <div class="most-reviews-card-container">
                <div class="most-reviews-card">
                    <div class="most-reviews-image">
                        <img src="${slicedMostReviewsByGenre[index].img}">
                    </div>
                    <div class="most-reviews-name">
                        <p>${slicedMostReviewsByGenre[index].title}</p>
                    </div>
                    <div class="most-reviews-score">
                        <p>Reviews: ${slicedMostReviewsByGenre[index].reviews}</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".most-reviews-by-genre").innerHTML += tab;

        // ----- Info about book ----- //

        document
          .querySelectorAll(".most-reviews-card-container")
          .forEach((bookCard, index) => {
            bookCard.addEventListener("click", () => {
              showBookInfo(slicedMostReviewsByGenre[index]);
              homePage.style.display = "none";
              booksPage.style.display = "flex";
              booksPageButton.classList.add("active");
              homePageButton.classList.remove("active");
              document.querySelector(".all-books").style.display = "none";
              document.querySelector(".genre-books").style.display = "none";
              document.querySelector(".book-info-container").style.display =
                "flex";
              document
                .querySelector(".back-button img")
                .addEventListener("click", () => {
                  homePage.style.display = "flex";
                  booksPage.style.display = "none";
                  booksPageButton.classList.remove("active");
                  homePageButton.classList.add("active");
                });
            });
          });
      }
    }

    // ----- Highest Rated Books ----- //

    const highestRatedBooks = [...filteredBooks].sort((a, b) => {
      return a.rating < b.rating ? 1 : a.rating > b.rating ? -1 : 0;
    });

    let slicedHighestRatedBooks = highestRatedBooks.slice(0, 4);

    function bestRating() {
      for (let index = 0; index < slicedHighestRatedBooks.length; index++) {
        const tab = `
          <div class="best-rating-card-container">
                <div class="best-rating-card">
                    <div class="best-rating-image">
                        <img src="${slicedHighestRatedBooks[index].img}">
                    </div>
                    <div class="best-rating-name">
                        <p>${slicedHighestRatedBooks[index].title}</p>
                    </div>
                    <div class="best-rating-score">
                        <p>Rating: ${slicedHighestRatedBooks[index].rating}</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".best-rating").innerHTML += tab;

        // ----- Info about book ----- //

        document
          .querySelectorAll(".best-rating-card-container")
          .forEach((bookCard, index) => {
            bookCard.addEventListener("click", () => {
              showBookInfo(slicedHighestRatedBooks[index]);

              homePage.style.display = "none";
              booksPage.style.display = "flex";
              booksPageButton.classList.add("active");
              homePageButton.classList.remove("active");
              document.querySelector(".all-books").style.display = "none";
              document.querySelector(".genre-books").style.display = "none";
              document.querySelector(".book-info-container").style.display =
                "flex";
              document
                .querySelector(".back-button img")
                .addEventListener("click", () => {
                  homePage.style.display = "flex";
                  booksPage.style.display = "none";
                  booksPageButton.classList.remove("active");
                  homePageButton.classList.add("active");
                });
            });
          });
      }
    }

    // ----- All Books ----- //

    let slicedBooks = filteredBooks.slice(0, 100);
    let slicedAdultBooks = books.slice(0, 100);

    function allBooks() {
      let allBooks;
      if (checkbox.checked) {
        allBooks = slicedAdultBooks;
      } else {
        allBooks = slicedBooks;
      }
      document.querySelector(".book-container").innerHTML = "";

      for (let index = 0; index < allBooks.length; index++) {
        tab = `
            <div class="book-card-container">
                <div class="book-card">
                    <div class="book-card-image">
                        <img src="${allBooks[index].img}">
                    </div>
                    <div class="book-card-name">
                        <p>${allBooks[index].title}</p>
                    </div>
                    <div class="book-card-score">
                        <p>Rating: ${allBooks[index].rating}</p>
                    </div>
                </div>
            </div>
        `;
        document.querySelector(".book-container").innerHTML += tab;

        // ----- Info about book ----- //

        document
          .querySelectorAll(".book-card-container")
          .forEach((bookCard, index) => {
            bookCard.addEventListener("click", () => {
              showBookInfo(allBooks[index]);

              document.querySelector(".all-books").style.display = "none";
              document.querySelector(".book-info-container").style.display =
                "flex";
              document
                .querySelector(".back-button img")
                .addEventListener("click", () => {
                  genreButton.classList.remove("active");
                  allBooksButton.classList.add("active");
                  document.querySelector(".all-books").style.display = "grid";
                  document.querySelector(".genre-books").style.display = "none";
                  document.querySelector(".book-info-container").style.display =
                    "none";
                });
            });
          });
      }
    }

    // ----- Genre Dropdown ----- //

    let slicedGenres = underageGenres.slice(0, 100);
    let slicedAdultGenres = genres.slice(0, 100).sort();

    function genreDropdown() {
      let allGenres;
      if (checkbox.checked) {
        allGenres = slicedAdultGenres;
      } else {
        allGenres = slicedGenres;
      }
      document.querySelector(".dropdown-content").innerHTML = "";

      for (let index = 0; index < allGenres.length; index++) {
        let genre = `
          <a class="dropdown-option" href="#">${allGenres[index]}</a>
        `;
        document.querySelector(".dropdown-content").innerHTML += genre;
      }

      // ----- Genre Books Options ----- //

      let genreOption = document.querySelectorAll(".dropdown-option");

      genreOption.forEach((option) => {
        option.addEventListener("click", () => {
          genreButton.classList.add("active");
          allBooksButton.classList.remove("active");
          document.querySelector(".all-books").style.display = "none";
          document.querySelector(".genre-books").style.display = "grid";
          document
            .querySelectorAll(".book-info-container")
            .forEach((bookInfoCard) => {
              bookInfoCard.style.display = "none";
            });
          document.querySelector(
            ".genre-text"
          ).innerHTML = `GENRE: ${option.innerHTML}`;

          // ----- Genre Book Cards ----- //

          let genreBooks = filteredBooks.filter((book) => {
            return book.genre.includes(option.innerHTML);
          });
          let adultGenreBooks = slicedAdultBooks.filter((book) => {
            return book.genre.includes(option.innerHTML);
          });

          function showGenreBooks() {
            let allBooks;
            if (checkbox.checked) {
              allBooks = adultGenreBooks;
            } else {
              allBooks = genreBooks;
            }
            document.querySelector(".genre-book-container").innerHTML = "";

            for (let index = 0; index < allBooks.length; index++) {
              tab = `
            <div class="genre-book-card-container">
                <div class="genre-book-card">
                    <div class="genre-book-image">
                        <img src="${allBooks[index].img}">
                    </div>
                    <div class="genre-book-name">
                        <p>${allBooks[index].title}</p>
                    </div>
                    <div class="genre-book-card-score">
                        <p>Rating: ${allBooks[index].rating}</p>
                    </div>
                </div>
            </div>
        `;
              document.querySelector(".genre-book-container").innerHTML += tab;

              // ----- Info about book ----- //

              document
                .querySelectorAll(".genre-book-card-container")
                .forEach((bookCard, index) => {
                  bookCard.addEventListener("click", () => {
                    showBookInfo(allBooks[index]);
                    document.querySelector(".genre-books").style.display =
                      "none";
                    document.querySelector(
                      ".book-info-container"
                    ).style.display = "flex";
                    document
                      .querySelector(".back-button img")
                      .addEventListener("click", () => {
                        genreButton.classList.add("active");
                        allBooksButton.classList.remove("active");
                        document.querySelector(".all-books").style.display =
                          "none";
                        document.querySelector(".genre-books").style.display =
                          "grid";
                        document
                          .querySelectorAll(".book-info-container")
                          .forEach((bookInfoCard) => {
                            bookInfoCard.style.display = "none";
                          });
                      });
                  });
                });
            }
          }
          document.querySelector(".genre-book-container").innerHTML = "";
          showGenreBooks(allBooks);
        });
      });
    }

    genreDropdown();
    allBooks();
    bestRating();
    mostReviews();

    checkbox.addEventListener("change", () => {
      allBooks();
      genreDropdown();
    });

    booksPageButton.addEventListener("click", () => {
      homePage.style.display = "none";
      booksPage.style.display = "flex";
      booksPageButton.classList.add("active");
      homePageButton.classList.remove("active");
      genreButton.classList.remove("active");
      allBooksButton.classList.add("active");
      document.querySelector(".all-books").style.display = "grid";
      document.querySelector(".genre-books").style.display = "none";
      document.querySelector(".book-info-container").style.display = "none";
    });

    homePageButton.addEventListener("click", () => {
      homePage.style.display = "flex";
      booksPage.style.display = "none";
      booksPageButton.classList.remove("active");
      homePageButton.classList.add("active");
    });

    allBooksButton.addEventListener("click", () => {
      genreButton.classList.remove("active");
      allBooksButton.classList.add("active");
      document.querySelector(".all-books").style.display = "grid";
      document.querySelector(".genre-books").style.display = "none";
      document.querySelector(".book-info-container").style.display = "none";
    });

    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // searchTitle();
        searched();
      }
    });
  } catch (error) {
    console.log(error);
  }
}
getBook();
