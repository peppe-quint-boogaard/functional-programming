const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: '1e19898c87464e239192c8bfe422f280',
  secret: '4289fec4e962a33118340c888699438d'
});

function checkValue(author) {
  console.log(author);
  if (typeof author === "undefined") {
    // console.log('Het is undefined');
    return 'Author unknown';
  } else {
    // console.log('Het loopt goed');
    return author;
  }
}

client.get('search', {
  q: 'oorlog in het buitenland',
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
      Year : book.publication.year.$t,
      Author : checkValue(book.authors.author.$t·)
      // Language : book.languages.language
    }
    // console.log(book); // Fallback results
    resList.push([bookList]);
  })
  console.log(resList);
  checkValue();
})
.catch(err => console.log(err)) // Something went wrong in the request to the API
