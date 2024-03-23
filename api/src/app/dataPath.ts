const path = require('path');
const fs = require('fs');

export function dataPath(...filePath: string[]) {
  return path.resolve(__dirname, '../../data', ...filePath);
}

export function dataTestPath(...filePath: string[]) {
  const dataTestPath = path.resolve(__dirname, '../../data/test');
  if (!fs.existsSync(dataTestPath)) {
    fs.mkdirSync(dataTestPath);
  }
  return path.resolve(dataTestPath, ...filePath);
}
