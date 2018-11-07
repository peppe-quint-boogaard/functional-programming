const OBA = require('oba-api');
const fs = require('fs');
require('dotenv').config();


const public_key = process.env.DB_PUBLIC;
const secret_key = process.env.DB_SECRET;
// setup authentication to api server
const client = new OBA({
  // proQuest API Keys
  public: public_key,
  secret: secret_key
});

const resList = [];
responses = [];

// indicate amount of pages to request
const amountPages = 21;
for (var i = 1; i < amountPages; i++) {
  receiveResult(i);
}

function receiveResult(pageNumber) { //with some help of Joost
  responses.push(
    client.get('search', {
      q: 'language:ger',
      sort: 'title',
      page: pageNumber,
      facet: 'type(book)',
      refine: true
    })
    .then(function(results) {
      JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
        let bookRes = {
          Id: parseInt(book.id.nativeid),
          Title : book.titles.title.$t,
          Author : (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t,
          Year : (typeof book.publication.year === "undefined") ? "Unknown" : book.publication.year.$t,
          Language : (typeof book.languages === "undefined") ? "Unknown" : book.languages.language.$t,
          Pages : (typeof book.description === "undefined") ? "Unknown" : book.description['physical-description'].$t,
          Location : (typeof book.publication.publishers.publisher.place === "undefined") ? "Unknown" : book.publication.publishers.publisher.place
        }
        // fallback result
        // console.log(book);

        // pages: cut off part after number and paste 'pages'
        let pagesString = bookRes.Pages;
        let indexPageString = pagesString.split(/[p: ]/)[0].replace(/[\[\]']+/g, '').concat(' pages');
        bookRes.Pages = indexPageString;

        // title: cut off part after /
        let titleString = bookRes.Title;
        let indexTitleString = titleString.split('/')[0].replace(/[\[\]']+/g, '').trim();
        bookRes.Title = indexTitleString;

        // location: clean up name of the location
        let locationString = bookRes.Location;
        let indexLocationString = locationString.replace(/[\[\]']+/g, '');
        bookRes.Location = indexLocationString;

        // language: change value of string to correct languages
        let languageString = bookRes.Language;
        let indexLanguageString = languageString.replace('ger', 'German');
        bookRes.Language = indexLanguageString;

        resList.push(bookRes);
      })
    })
    .catch(err => console.log(err)) // something went wrong in the request to the API
  )
}

// remove duplicate id's
// https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript/
function removeDuplicates(originalArray, prop) {
  let newArray = [];
  let lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

// with some help of Joost
Promise.all(responses).then(function(totalRes) {
  var uniqueResults = removeDuplicates(resList, "Id");

  // sort results on the location of the publishers
  uniqueResults.sort((a, b) => (a.Year < b.Year ? -1 : a.Year > b.Year ? 1 : 0));

  // https://stackabuse.com/reading-and-writing-json-files-with-node-js/
  let data = JSON.stringify(uniqueResults, null, 2);
  fs.writeFileSync('oba-data.json', data, 'utf8');

  console.log(uniqueResults);
  console.log(uniqueResults.length); // total amount results
})
