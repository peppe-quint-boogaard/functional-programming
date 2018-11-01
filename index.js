const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: '1e19898c87464e239192c8bfe422f280',
  secret: '4289fec4e962a33118340c888699438d'
});

client.get('search', {
  q: 'oorlog',
  sort: 'relevance',
  page: '9',
  facet: 'type(book)',
  refine: true
})
.then(function(results) {
  const resList = [];
  JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
    var bookList = {
      Title : book.titles.title.$t,
      Author : (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t,
      Year : book.publication.year.$t,
      Language : (typeof book.languages === "undefined") ? "Language unknown" : book.languages.language.$t,
      Id : book.id
    }
    // console.log(book); // Fallback results
    resList.push([bookList]);
  })
  console.log(resList);
})
.catch(err => console.log(err)) // Something went wrong in the request to the API
