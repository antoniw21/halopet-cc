// const fs = require('fs');
// const { createCanvas, loadImage } = require('canvas');
// const tf = require('@tensorflow/tfjs-node');

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
//     // Load the model architecture from the JSON file
//     // const modelPath = './tfjs_model/model.json';
//     // const modelArchitecture = await readFile(modelPath, 'utf8');

//     const modelArchitecture = require('./tfjs_model/model.json');

//     // Create a new model from the loaded architecture
//     // const model = await tf.loadGraphModel(
//     //   tf.io.fromMemory(modelArchitecture)
//     // );

//     const model = await tf.loadGraphModel(tf.io.fromMemory(modelArchitecture));

//     // Load the weights for each layer
//     const weightFiles = [
//       './tfjs_model/group1-shard1of11.bin',
//       './tfjs_model/group1-shard2of11.bin',
//       './tfjs_model/group1-shard3of11.bin',
//       './tfjs_model/group1-shard4of11.bin',
//       './tfjs_model/group1-shard5of11.bin',
//       './tfjs_model/group1-shard6of11.bin',
//       './tfjs_model/group1-shard7of11.bin',
//       './tfjs_model/group1-shard8of11.bin',
//       './tfjs_model/group1-shard9of11.bin',
//       './tfjs_model/group1-shard10of11.bin',
//       './tfjs_model/group1-shard11of11.bin'
//     ];

//     for (let i = 0; i < weightFiles.length; i++) {
//       const weightData = await readFile(weightFiles[i]);
//       model.layers[i].setWeights([tf.tensor(weightData)]);
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

// const preprocessImage = async (imagePath) => {
//   const image = await loadImage(imagePath);
//   const canvas = createCanvas(150, 150);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(image, 0, 0, 150, 150);
//   const imageData = ctx.getImageData(0, 0, 150, 150);
//   const tensor = tf.browser.fromPixels(imageData).expandDims();
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


// const fs = require('fs');
// const { createCanvas, loadImage } = require('canvas');
// const tf = require('@tensorflow/tfjs-node');

// const predictHandler = async (imagePath) => {
//   try {
//     // Load the model architecture from the JSON file
//     const modelArchitecture = require('./tfjs_model/model.json');

//     // Create a new model from the loaded architecture
//     const model = await tf.loadGraphModel(
//       tf.io.fromMemory(modelArchitecture)
//     );

//     // Load the weights for each layer
//     const weightFiles = [
//       './tfjs_model/group1-shard1of11.bin',
//       './tfjs_model/group1-shard2of11.bin',
//       './tfjs_model/group1-shard3of11.bin',
//       './tfjs_model/group1-shard4of11.bin',
//       './tfjs_model/group1-shard5of11.bin',
//       './tfjs_model/group1-shard6of11.bin',
//       './tfjs_model/group1-shard7of11.bin',
//       './tfjs_model/group1-shard8of11.bin',
//       './tfjs_model/group1-shard9of11.bin',
//       './tfjs_model/group1-shard10of11.bin',
//       './tfjs_model/group1-shard11of11.bin'
//     ];

//     for (let i = 0; i < weightFiles.length; i++) {
//       const weightData = await tf.io.browserFiles([weightFiles[i]]);
//       const weights = await tf.loadWeights(weightData);
//       model.layers[i].setWeights(weights);
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

// const preprocessImage = async (imagePath) => {
//   const image = await loadImage(imagePath);
//   const canvas = createCanvas(150, 150);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(image, 0, 0, 150, 150);
//   const imageData = ctx.getImageData(0, 0, 150, 150);
//   const tensor = tf.browser.fromPixels(imageData).expandDims();
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
const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const https = require('https');

const readFile = (path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const predictHandler = async (imagePath) => {
  try {
    // Load the model
    const model = await tf.loadGraphModel('https://storage.googleapis.com/allobucket/tfjs_model/model.json');

    // Load the weights for each layer
    const weightFiles = [
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard1of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard2of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard3of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard4of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard5of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard6of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard7of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard8of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard9of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard10of11.bin',
      'https://storage.googleapis.com/allobucket/tfjs_model/group1-shard11of11.bin',
    ];

    for (let i = 0; i < weightFiles.length; i++) {
      const weightData = await downloadFile(weightFiles[i]);
      model.execute(tf.tensor(weightData), [`conv${i}_kernel`]);
    }

    // Preprocess the image
    const preprocessedImage = await preprocessImage(imagePath);

    // Make a prediction using the loaded model
    const prediction = await model.predict(preprocessedImage);

    return prediction;
  } catch (error) {
    console.error(error);
  }
};

const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      });
      response.on('end', () => {
        resolve(Buffer.concat(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

const preprocessImage = async (imagePath) => {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(150, 150);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, 150, 150);
  const imageData = ctx.getImageData(0, 0, 150, 150);
  const tensor = tf.browser.fromPixels(imageData).expandDims(0).toFloat();
  return tensor;
};

const imageFilePath = './1.PNG';
predictHandler(imageFilePath)
  .then((result) => {
    console.log('Prediction result:', result);
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });