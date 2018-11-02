const OBA = require('oba-api');
require('dotenv').config();

let public_key = process.env.DB_PUBLIC;
let secret_key = process.env.DB_SECRET;
// setup authentication to api server
const client = new OBA({
  // proQuest API Keys
  public: public_key,
  secret: secret_key
});

client.get('search', {
  q: 'language:ger',
  sort: 'title',
  page: '1',
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
      Pages : (typeof book.description === "undefined") ? "Unknown" : book.description['physical-description'].$t,
      Location : (typeof book.publication.publishers.publisher.place === "undefined") ? "Unknown" : book.publication.publishers.publisher.place
    }
    // fallback result
    // console.log(book);

    // pages: cut off part after number and paste 'pages'
    let pagesString = bookRes.Pages;
    let indexPageString = pagesString.split(/[p: ]/)[0].replace(/[\[\]']+/g, '').concat(' pages');
    // console.log(indexPageString);
    // return indexPageString
    bookRes.Pages = indexPageString;

    // title: cut off part after /
    let titleString = bookRes.Title;
    let indexTitleString = titleString.split('/')[0].trim();
    // console.log(indexTitleString);
    // return indexTitleString
    bookRes.Title = indexTitleString;

    //location: clean up name of the location
    let locationString = bookRes.Location;
    let indexLocationString = locationString.replace(/[\[\]']+/g, '');
    // console.log(indexLocationString);
    // return indexLocationString
    bookRes.Location = indexLocationString;

    resList.push(bookRes);
  })
  // get years of publication of the founded books
  var resListYears = resList.map( years => years.Year );
  // console.log(resListYears);

  // get language of the founded books
  // var resListLang = resList.map( lang => lang.Language );
  // console.log(resListLang);

  // console.log(resListYears + resListLang);

  console.log(resList);
})
.catch(err => console.log(err)) // something went wrong in the request to the API
