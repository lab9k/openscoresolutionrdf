import express from 'express';
import $rdf from 'rdflib';
import getData from './fetch.js';
import { extractRows } from './row.js';
import { mapToRdf } from './rml/index.js';

const app = express();

app.get('/score', (req, res, next) => {
  const format = req.query.format || 'json';
  const data = getData(
    'https://spreadsheets.google.com/feeds/cells/1vBJ9rB7NttdM98DbF0cBm6C1QD5nVmom53iisk3mtTc/1/public/full?alt=json',
  ).catch((err) => console.log(err));

  data.then(({ feed: { entry } }) => {
    const filtered = entry.filter((e) => e.gs$cell.col <= 7);
    const rows = extractRows(filtered);
    return mapToRdf(JSON.stringify(rows), format === 'json');
  }).then((rdf) => {
    switch (format) {
      case 'json':
        res.json(rdf);
        break;
      case 'ttl':
        // eslint-disable-next-line no-case-declarations
        const store = new $rdf.Formula();
        $rdf.parse(rdf, store, 'http://example.org', 'text/n3');

        $rdf.serialize(undefined, store, 'http://example.org', 'text/turtle', (err, triples) => {
          if (err) { console.error(err); }
          res.setHeader('Content-type', 'text/turtle');
          res.send(triples);
        });
        break;
      case 'rdf':
        res.setHeader('Content-type', 'application/rdf+xml');
        res.set({ 'Content-Disposition': 'attachment; filename="score.rdf"' });
        res.send(rdf);
        break;
      default:
        next(new Error(`format "${format}" is not valid, use "json"/"rdf"/"ttl"`));
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at http://localhost:${port}`));
