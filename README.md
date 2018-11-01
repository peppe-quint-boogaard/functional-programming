# Openbare Bibliotheek Amsterdam API

## Proces

### 29 oktober 2018
[Package van Rijk van Zanten](https://github.com/rijkvanzanten/node-oba-api) geïnstalleerd om via Node makkelijk met de API van de OBA te communiceren.
``` bash
  $ npm install rijkvanzanten/node-oba-api
```
Daarnaast heb ik onderzoek gedaan naar het gebruik van de API. In het bestand [index.js](index.js) wordt er via ``client.get('search'){}`` gezocht naar de resultaten. Er zijn een aantal waardes die ik heb toegevoegd en heb gewijzigd:
``` javascript
  client.get('search', {
    q: 'oorlog', // objecten worden gezocht met die te maken hebben met het thema oorlog
    sort: 'relevance', // de resultaten worden gesorteerd op relevantie
    page: '9', // de resulaten van pagina 9 worden getoond
    facet: 'type(book)', // alleen het type boek wordt gezocht
    refine: true // zorgt er voor dat er alleenb boeken getoond worden
  })
```

### 30 oktober 2018
Om er voor te zorgen dat de data getoond wordt in de Terminal ontleedt JSON de data. Dit gebeurt nadat er naar data is gezocht in de API:
``` javascript
  .then(function(results) {
    JSON.parse(results).aquabrowser.results.result.forEach(function(book) {
      console.log(book);
    })
  })
```

Via deze functie wordt elk gevonden resultaat in een functie gezet en vervolgens gelogd in de ``console.log``. Door middel van ```node index.js ``` krijg ik de data terug in de Terminal.
Hierdoor zie ik welke data er beschikbaar is. Op basis hiervan heb ik een aantal onderzoeksvragen opgesteld.

#### Onderzoeksvragen
1. Is er een verband tussen het aantal bladzijde van een boek en het jaartal dat het is gepubliceerd?
2. Zijn er meer boeken uit Duitsland gepubliceerd tijdens de 2de wereldoorlog?
3. Is er een verband met de dikte van een boek en de taal?
4. Zijn er meer boeken gepubliceerd over de 1ste of 2de wereldoorlog?
5. Zijn de mannelijke schrijvers die dikkere boeken maken, of zijn dat de vrouwelijke schrijvers?

### 31 oktober 2018
Uitgezocht welke code er nodig is om er voor te zorgen dat de bijv. de titel van een boek alleen getoond wordt.
``` javascript
  console.log(book.titles.title.$t, id) // pakt de titel door te zoeken in b0ok -> titles -> title.
```
Bij de titel van het boek lukt dit, maar bij de auteur van het boek kan het zo zijn dat er meerdere auteurs mee hebben geholpen aan het boek, dus werkt het niet om direct te zoeken, zoals de code hieronder:
``` javascript
  console.log(book.authors.author.$t); // werkt niet: "undefined"
```
Om te checken of er uberhaupt een auteur aanwezig is, gebruik ik de volgende code:
``` javascript
  (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t
  //  als de auteur of de hoofd-auteur 'undefined' is, wordt er 'Author unknown' getoond, anders wordt de auteur opgehaald
```
Dit stukje code heb ik ook gebruikt bij de pagina-nummering en het jaar van publicatie van een boek. '_Missing data_' is de oorzaak dat er ``undefined`` komt te staan.

### 1 november 2018

Om de resultaten van de zoekopdrachten goed weer te geven, heb ik de values in een variabelen gestopt:
``` javascript
  let bookRes = {
    Title : book.titles.title.$t, // titel van het boek
    Author : (typeof book.authors === "undefined" || typeof book.authors['main-author'] === "undefined") ? 'Author unknown' : book.authors['main-author'].$t, // auteur van het boek
    Year : book.publication.year.$t, // jaar van uitgave
    Language : (typeof book.languages === "undefined") ? "Unknown" : book.languages.language.$t, // taal van het boek
    Pages : (typeof book.description === "undefined") ? "Unknown" : book.description['physical-description'].$t // aantal pagina's van het boek
  }
```

Hierdoor wordt er per boek een Array aangemaakt. Dit doe ik ook door elk boek te pushen naar een nieuwe Array.
``` javascript
  let resList = []; // lege array
  resList.push([bookRes]); // elk zoekresultaat wordt in de lege array gepusht
  console.log(resList); // de lijst met boeken wordt hierdoor getoond in de terminal
```

Helaas wordt er op dit moment alleen de eerste 20 resultaten weergegeven, terwijl er meer resultaten zijn.

Omdat de data die binnenkomt erg rommelig is, moet de data 'schoongemaakt' worden. Bijv. bij het aantal paginanummers.
Zonder aanpassing aan de value wordt er dit getoond:
``` bash
  Pages: '343 p., [16] p. pl: ill ; 24 cm',
```

Het enige wat ik wil laten zien is het aantal paginanummers. Daarom moet alles na het eerste cijfer van de zin verwijderd worden.
``` javascript
  let pagesString = bookRes['Pages']; // alle waarde van deze value wordt in deze variabelen gestopt
  let indexPageString = pagesString.split(/[p: ]/)[0].replace(/[\[\]']+/g, '').concat(' pages');
  // eerst wordt alles vanaf 'p:' er vanaf gehaald
  // vervolgens worden [] vervangen door een leeg veld
  // als laatste wordt er achter elke waarde het woord ' pages' geplakt
  console.log(indexPageString); // controle of het werkt
```

Het lukt me nog niet de nieuwe waarde terug te geven aan het resultaat van het boek.
