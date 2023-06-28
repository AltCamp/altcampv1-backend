const { existsSync, promises, writeFile } = require('fs');

async function base64EncodeImage(path) {
  try {
    if (!existsSync(path)) {
      throw new Error(`Can not locate the image file at ${path}`);
    }

    const imageBuffer = await promises.readFile(path);
    const base64String = imageBuffer.toString('base64');

    return base64String;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const image = '/home/tobisupreme/Downloads/Images/freestroke-1080p.png';
// const image =
//   '/home/tobisupreme/Pictures/Screenshots/Screnshot from 2023-06-23 02-11-51.png';

(async () => {
  const base64Image = await base64EncodeImage(image);
  writeJson(
    './image.txt',
    `data:image/${getFileExtension(image)};base64,${base64Image}`
  );
})();
// const base64Image = base64EncodeImage(image);
// base64Image.then((data) => console.log('🚀 ~ file: hehe.js:24 ~ data:', data));
/**
 *
 * @param {string} filePath Path to save JSON file
 * @param {object} jsonObj Object to save as JSON
 */
function writeJson(filePath, jsonObj) {
  writeFile(filePath, JSON.stringify(jsonObj, null, 2), (err) => {
    if (err) {
      console.log('Error occured writing JSON:', err);
    } else {
      console.log('JSON object written successfully');
    }
  });
}

function getFileExtension(filePath) {
  const fileName = filePath.split('.').pop();

  if (filePath.indexOf('.') === -1 || filePath.endsWith('/')) {
    return '';
  }

  return fileName.toLowerCase();
}
