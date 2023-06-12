const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

async function loadModelAndMakePredictions(path) {
  try {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/allobucket/modelstfjs/model.json');

    // Load the image
    const imagePath = path;

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

    const predictedClass = predictions.argMax(1).dataSync()[0];

    let result;
    if (predictedClass === 2) {
      result = "Healthy";
    } else if (predictedClass === 1) {
      result = "Fungal";
    } else {
      result = "Bacterial";
    }

    console.log("Predicted class:", result);
    // Dispose the model and tensors
    inputTensor.dispose();
    predictions.dispose();
    model.dispose();
    return result;

  } catch (error) {
    console.error('Error:', error);
  }
}

function preprocessImageData(imageData) {
  // preprocessing steps:
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

module.exports = loadModelAndMakePredictions;