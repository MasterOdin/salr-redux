/* eslint-env node */

import * as fs from 'node:fs';
import * as path from 'node:path';

const emoticonPath = path.join(__dirname, '..', 'extension', 'images', 'emoticons')

const images: string[] = [];

for (const file of fs.readdirSync(emoticonPath)) {
  if (file.includes('@2x')) {
    images.push(file);
  }
}

fs.writeFileSync(
  path.join(emoticonPath, 'emoticons.json'),
  JSON.stringify(images)
);
