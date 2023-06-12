// const fs = require('fs');
// const { createCanvas, loadImage } = require('canvas');
// const tf = require('@tensorflow/tfjs-node');
// const https = require('https');

// const readFile = (path, encoding) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, encoding, (error, data) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// };

// const predictHandler = async (imagePath) => {
//   try {
//     // Load the model
//     const model = await tf.loadGraphModel('https://storage.googleapis.com/allobucket/tfjs_model/model.json');

//     // Load the weights for each layer
//     const weightFiles = [
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard1of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard2of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard3of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard4of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard5of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard6of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard7of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard8of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard9of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard10of11.bin',
//       'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard11of11.bin',
//     ];

//     for (let i = 0; i < weightFiles.length; i++) {
//       const weightData = await downloadFile(weightFiles[i]);
//       model.execute(tf.tensor(weightData), [`conv${i}_kernel`]);
//     }

//     // Preprocess the image
//     const preprocessedImage = await preprocessImage(imagePath);

//     // Make a prediction using the loaded model
//     const prediction = await model.predict(preprocessedImage);

//     return prediction;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const downloadFile = (url) => {
//   return new Promise((resolve, reject) => {
//     https.get(url, (response) => {
//       let data = [];
//       response.on('data', (chunk) => {
//         data.push(chunk);
//       });
//       response.on('end', () => {
//         resolve(Buffer.concat(data));
//       });
//     }).on('error', (error) => {
//       reject(error);
//     });
//   });
// };

// const preprocessImage = async (imagePath) => {
//   const image = await loadImage(imagePath);
//   const canvas = createCanvas(150, 150);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(image, 0, 0, 150, 150);
//   const imageData = ctx.getImageData(0, 0, 150, 150);
//   const tensor = tf.browser.fromPixels(imageData).expandDims(0).toFloat();
//   return tensor;
// };

// const imageFilePath = './1.PNG';
// predictHandler(imageFilePath)
//   .then((result) => {
//     console.log('Prediction result:', result);
//   })
//   .catch((error) => {
//     console.error('An error occurred:', error);
//   });

const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

async function loadModelAndMakePredictions() {
  try {
    // Load the model
   // const modelPath = './modelstfjs/model.json';
   // const modelData = fs.readFileSync(modelPath, 'utf8');
    //const model = await tf.loadLayersModel(tf.io.fileSystem(modelData));
    const model = await tf.loadLayersModel('https://storage.googleapis.com/allobucket/modelstfjs/model.json');

    // Load the image
    const imagePath = '1.PNG';
    const image = await loadImage(imagePath);

    // Resize the image to 150x150 pixels
    const resizedImage = await sharp(imagePath).resize(150, 150).toBuffer();

    // Preprocess the image
    const canvas = createCanvas(150, 150);
    const ctx = canvas.getContext('2d');
    const resizedImageData = await loadImage(resizedImage);
    ctx.drawImage(resizedImageData, 0, 0);
    const imageData = ctx.getImageData(0, 0, 150, 150);
    const preprocessedData = preprocessImageData(imageData);

    // Convert the preprocessed data to a tensor
    const inputTensor = tf.tensor(preprocessedData, [1, 150, 150, 3]);

    // Make predictions
    const predictions = model.predict(inputTensor);
    predictions.print();
  } catch (error) {
    console.error('Error:', error);
  }
}

function preprocessImageData(imageData) {
  // Example preprocessing steps:
  // - Normalize pixel values to the range [0, 1]
  // - Convert the image to the appropriate color space
  // - Flatten or reshape the image data as needed
  // - Apply any other required preprocessing

  const data = imageData.data;
  const preprocessedData = [];

  // Normalize pixel values to the range [0, 1]
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    preprocessedData.push(r, g, b);
  }

  return preprocessedData;
}

loadModelAndMakePredictions();