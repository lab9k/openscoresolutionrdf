import express from 'express';
import getData from './fetch.js';
import { extractRows } from './row.js';
import { mapToRdf } from './rml/index.js';

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
    res.setHeader('Content-type', 'application/rdf+xml');
    // res.set({ 'Content-Disposition': 'attachment; filename="score.rdf"' });
    res.send(rdf);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at http://localhost:${port}`));
