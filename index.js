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
    sort: "year",
    refine: true,
    facet: ["type(book)", "language(ger)"],
    count: 10,
    log: true
  })
  .then(items => {
    const listOfResults = items.map(books => getBookObject(books));
    console.log(JSON.stringify(listOfResults, null, 1));
  })
  .catch(err => console.log(err));

function getBookObject(data) {
  createObject = {
    title: data.titles.title.$t
  };
  return createObject;
}
