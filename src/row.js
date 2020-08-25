export function extractRows(entries) {
  const headers = entries
    .filter((e) => e.gs$cell.row === '1')
    .reduce((acc, curr) => {
      acc[curr.gs$cell.col] = {
        col: curr.gs$cell.col,
        row: curr.gs$cell.row,
        title: curr.content.$t,
      };
      return acc;
    }, {});
  const cells = entries.filter((e) => e.gs$cell.row !== '1');
  const rows = [];
  cells.forEach((c) => {
    const cellRow = c.gs$cell.row;
    const cellCol = c.gs$cell.col;
    const { title } = headers[cellCol];
    const content = c.content.$t;

    const obj = rows.find((el) => el.row === cellRow);
    if (obj) {
      obj[title] = content;
    } else {
      rows.push({
        row: cellRow,
        [title]: content,
      });
    }
  });
  return rows;
}
