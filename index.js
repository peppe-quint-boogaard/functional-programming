const OBA = require('oba-api');
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
const amountPages = 6;
for (var i = 1; i < amountPages; i++) {
  receiveResult(i);
}

function receiveResult(pageNumber) { //with some help of Joost
  responses.push(
    client.get('search', {
      q: 'year:2016 muziek',
      sort: 'title',
      page: pageNumber,
      facet: 'type(book)',
      refine: true
    })
    .then(function(results) {
      JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
        let bookRes = {
          Title : book.titles.title.$t,
          Author : (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t,
          Year : book.publication.year.$t,
          Language : (typeof book.languages === "undefined" || typeof book.languages.language) ? "Unknown" : book.languages.language.$t,
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
        let indexTitleString = titleString.split('/')[0].trim();
        bookRes.Title = indexTitleString;

        //location: clean up name of the location
        let locationString = bookRes.Location;
        let indexLocationString = locationString.replace(/[\[\]']+/g, '');
        bookRes.Location = indexLocationString;

        resList.push(bookRes);
      })
      // get years of publication of the founded books
      // var resListYears = resList.map( years => years.Year );
      // console.log(resListYears);

      // get language of the founded books
      // var resListLang = resList.map( lang => lang.Language );
      // console.log(resListLang);

      // console.log(resListYears + resListLang);
    })
    .catch(err => console.log(err)) // something went wrong in the request to the API
  )
}

// with some help of Joost
Promise.all(responses).then(function(totalRes) {
  // sort results on the location of the publishers
  // function sortLocation(a, b) {
  //   if (a.Location < b.Location)
  //     return -1;
  //   if (a.Location > b.Location)
  //     return 1;
  //   return 0;
  // }

  resList.sort((a, b) => (a.Location < b.Location ? -1 : a.Location > b.Location ? 1 : 0));

  console.log(resList);
  console.log(resList.length); // total amount results
})
