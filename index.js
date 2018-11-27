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
    q: "duits",
    sort: "relevance",
    refine: true,
    facet: ["type(book)", "language(ger)"],
    count: 19434,
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
const getBookObject = item => {
  const bookObject = (createObject = {
    title: trimTitle(item),
    author: trimAuthor(item),
    year: item.publication.year.$t > 2018 ? false : item.publication.year.$t,
    place: trimLocation(item)
  });
  return bookObject;
};

// clean up string title of books
const trimTitle = data => {
  const getTitle =
    typeof data.titles["short-title"].$t === "undefined"
      ? "Unknown"
      : data.titles["short-title"].$t;
  return getTitle.split(/[:,/]/)[0].trim();
};

// clean up string location of publication
const trimLocation = data => {
  const getLocation =
    typeof data.publication.publishers.publisher.place === "undefined"
      ? "Unknown"
      : data.publication.publishers.publisher.place;
  return getLocation.replace(/[\[\]]/g, "");
};

// clean up string of author
const trimAuthor = data => {
  const getAuthor =
    typeof data.authors === "undefined" ||
    typeof data.authors["main-author"] === "undefined"
      ? "Unknown"
      : data.authors["main-author"].$t;
  return getAuthor.split(/[/]/)[0].trim();
};
