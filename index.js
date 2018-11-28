const OBAWrapper = require("node-oba-api-wrapper");
const fs = require("fs");
require("dotenv").config();

const public_key = process.env.DB_PUBLIC;
const secret_key = process.env.DB_SECRET;

const client = new OBAWrapper({
  public: public_key,
  secret: secret_key
});

client
  .get("search", {
    q: "buch",
    sort: "year",
    refine: true,
    facet: ["type(book)", "language(ger)"],
    count: 19429,
    log: true
  })
  .then(items => {
    const listOfResults = items.map(books => getBookObject(books));
    fs.writeFileSync(
      "data/data-oba.json",
      JSON.stringify(listOfResults, null, 1),
      "utf8"
    );
  })
  .catch(err => console.log(err));

// create object of results
const getBookObject = data => {
  const bookObject = (createObject = {
    title: cleanTitle(data),
    author: cleanAuthor(data),
    year: cleanYear(data)
  });
  return bookObject;
};

// clean up string title of books
const cleanTitle = data => {
  const getTitle =
    typeof data.titles.title.$t === "undefined"
      ? "Unknown"
      : data.titles.title.$t;
  return getTitle.split(/[:,/]/)[0].trim();
};

// clean up string of author
const cleanAuthor = data => {
  const getAuthor =
    typeof data.authors === "undefined" ||
    typeof data.authors["main-author"] === "undefined"
      ? "Unknown"
      : data.authors["main-author"].$t;
  return getAuthor.split(/[/]/)[0].trim();
};

// clean up unknown years
const cleanYear = data => {
  const getYear =
    typeof data.publication === "undefined" ||
    typeof data.publication.year === "undefined" ||
    typeof data.publication.year.$t === "undefined"
      ? "Unknown"
      : data.publication.year.$t;
  return getYear;
};
