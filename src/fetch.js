import fetch from 'node-fetch';

export default async (url) => {
  const req = await fetch(url, { method: 'GET' });
  return req.json();
};
