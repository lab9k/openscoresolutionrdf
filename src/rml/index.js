import { promises } from 'fs';
import rml from 'rocketrml';
import { RML_FILE, RML_OPTIONS } from './config.js';

const readFileAsync = promises.readFile;

export const mapToRdf = async (jsonstring) => {
  const fileContents = await readFileAsync(RML_FILE, { encoding: 'utf-8' });
  if (fileContents) {
    return rml.parseFileLive(fileContents, { input: jsonstring }, RML_OPTIONS)
      .catch((err) => console.error(err));
  }
  return null;
};
