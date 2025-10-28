/* eslint-disable */
const fs = require('fs');
const path = require('path');

const generatedPath = path.join(__dirname, 'src', 'prisma', 'generated');

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

deleteFolderRecursive(generatedPath);
console.log('Generated folder cleaned.');
