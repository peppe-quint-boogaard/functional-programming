// var list = document.getElementById("boekenlijst");
const OBA = require('oba-api');

// Setup authentication to api server
const client = new OBA({
  // ProQuest API Keys
  public: '1e19898c87464e239192c8bfe422f280',
  secret: '4289fec4e962a33118340c888699438d'
});

// General usage:
// client.get({ENDPOINT}, {PARAMS});
// ENDPOINT = search | details | refine | schema | availability | holdings
// PARAMS = API url parameter options (see api docs for more info)

// Client returns a promise which resolves the APIs output in JSON

// Example search to the word 'rijk' sorted by title:
client.get('search', {
  //  nederlandse wetenschappers in het buitenland biologie
  //  zoekterm
  //
  q: 'nederlandse wetenschappers in het buitenland',
  sort: 'title'
})
.then(function(results) {
  const boeken = [];
  JSON.parse(results).aquabrowser.results.result.forEach(function(boek, id) {
    // console.log(boek.titles.title.$t, id); // TITEL VAN HET BOEK
    // console.log(boek.authors.author.$t); // AUTEUR VAN HET BOEK
    // console.log(boek.publication.year.$t); // JAAR VAN PUBLICATIE
    boeken.push(boek.titles.title.$t, id);
    // boeken.map(function (value, index) {
    //   return index;
    // })
  })
  console.log(boeken);

})
.catch(err => console.log(err)) // Something went wrong in the request to the API

// Bij sommige autheurs werkt het wel, andere weer niet want dan staat er nog 'main-author' waardoor er niet bij te komen is.
