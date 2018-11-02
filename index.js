const OBA = require('oba-api');
require('dotenv').config();

let public_key = process.env.DB_PUBLIC;
let secret_key = process.env.DB_SECRET;
// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: public_key,
  secret: secret_key
});

client.get('search', {
  q: 'oorlog',
  sort: 'relevance',
  page: '9',
  facet: 'type(book)',
  refine: true
})
.then(function(results) {
  let resList = [];
  JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
    let bookRes = {
      Title : book.titles.title.$t,
      Author : (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t,
      Year : book.publication.year.$t,
      Language : (typeof book.languages === "undefined") ? "Unknown" : book.languages.language.$t,
      Pages : (typeof book.description === "undefined") ? "Unknown" : book.description['physical-description'].$t
    }
    // Fallback result
    // console.log(book);

    // Pages: Cut off part after number and paste 'pages'
    let pagesString = bookRes.Pages;
    let indexPageString = pagesString.split(/[p: ]/)[0].replace(/[\[\]']+/g, '').concat(' pages');
    // console.log(indexPageString);
    // return indexPageString
    bookRes.Pages = indexPageString;

    // Title: Cut off part after /
    let titleString = bookRes.Title;
    let indexTitleString = titleString.split('/')[0].trim();
    // console.log(indexTitleString);
    // return indexTitleString
    bookRes.Title = indexTitleString;

    resList.push(bookRes);
  })
  console.log(resList);
})
.catch(err => console.log(err)) // Something went wrong in the request to the API
