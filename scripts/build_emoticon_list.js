/* eslint-env node */

const fs = require('fs');
const path = require('path');

const emoticonPath = path.join(__dirname, '..', 'extension', 'images', 'emoticons')

const images = [];

for (const file of fs.readdirSync(emoticonPath)) {
  if (file.includes('@2x')) {
    images.push(file);
  }
}

fs.writeFileSync(
  path.join(emoticonPath, 'emoticons.json'),
  JSON.stringify(images)
);
