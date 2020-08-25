import express from 'express';
import { promises } from 'fs';
import getData from './fetch.js';
import { extractRows } from './row.js';
import { mapToRdf } from './rml/index.js';
import { DEBUG } from './rml/config.js';

const app = express();

app.get('/score.rdf', (req, res) => {
  const data = getData(
    'https://spreadsheets.google.com/feeds/cells/1vBJ9rB7NttdM98DbF0cBm6C1QD5nVmom53iisk3mtTc/1/public/full?alt=json',
  ).catch((err) => console.log(err));

  data.then(({ feed: { entry } }) => {
    const filtered = entry.filter((e) => e.gs$cell.col <= 7);
    const rows = extractRows(filtered);
    return mapToRdf(JSON.stringify(rows));
  }).then((rdf) => {
    if (!DEBUG) {
      res.setHeader('Content-type', 'application/rdf+xml');
      res.set({ 'Content-Disposition': 'attachment; filename="score.rdf"' });
      return res.send(rdf);
    }
    promises.writeFile('./score.rdf', rdf, { encoding: 'utf-8' });
    return res.json({ created: 1 });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at http://localhost:${port}`));
